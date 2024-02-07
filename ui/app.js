Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        var url = "http://127.0.0.1:5000/classify_image"

        $.post(url,{
            image_data : imageData
        }, function(data,status){
            /* Below is a sample response if you have two faces in an image lets say Rakesh Jhunjhunwala and Vijay Kedia together.
            Most of the time if there is one person in the image you will get only one element in below array
            data = [
                {
                    class :  "Vijay Kedia"
                    class_dictionary : 
                    Ashish Dhawan : 0
                    Raamdeo Agrawal : 2
                    Radhakrishnan Damani : 3
                    Rakesh Jhunjhunwala : 4
                    Ramesh Damani : 5
                    Sunil Singhania : 6
                    Vijay Kedia : 7
                    ashish kacholia : 1
                    class_probability : (8) [34.23, 0.69, 24.69, 1.5, 1.54, 5.1, 1.43, 30.82]
                },
                
            ]
            */
                        
            if(!data || data.length==0){
                $("#resultHolder").hide();
                $("#divClassTable").hide();
                $("#error").show();
            }

            let match = null;
            let bestScore = -1;
            for (let i=0;i<data.length;++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }

            if(match){
                $("#resultHolder").show();
                $("#divClassTable").show();
                $("#error").hide();

                $("#resultHolder").html($(`[data-player="${match.class}"`).html());

            }

        });
        
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();		
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});