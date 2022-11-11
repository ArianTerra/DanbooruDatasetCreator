const SITE_REGEX = /https:\/\/(danbooru|safebooru)\.donmai\.us\/posts\/\d+/;

//variables
var filename = "1200px-Cat03.jpg"

var orientation_v = 1
var options = {
    viewport: { width: 300, height: 300 },
    boundary: { width: 400, height: 400 },
    enableZoom: true,
    zoom: 0,
    enableOrientation: true,
    orientation: 1,
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg',
    format: 'jpeg'|'png'|'webp'
};


//initialize Croppie
var basic = $('#main-cropper').croppie(options);

// Change Event to Read file content from File input
$('#select_file').on('change', function () {
    if (this.files && this.files[0])
    {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#main-cropper').croppie('bind', {
                url: e.target.result,
                zoom: 0
            });
        }

        reader.readAsDataURL(this.files[0]);

        filename = this.files[0].name;
        console.log(filename);
    }
});

// Upload button to Post Cropped Image to Store.
$('#btnupload').on('click', function ()
{
    basic.croppie('result', {
            type: 'blob',
            size: { width: 512, height: 512 },
            quality: 1
        }).then(function (blob)
    {
        var formData = new FormData();

        formData.append('filename', filename);
        formData.append('blob', blob);
        formData.append('tags', $('#tags_input').val());

        var request = new XMLHttpRequest();
        request.open('POST', '/Home/ImageCrop/');
        request.send(formData);
        request.onreadystatechange = function () {
            // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200)
            {
                var response = JSON.parse(request.responseText);

                if (response.message == "OK")
                {
                    alert('Photo Cropped Successfully!');
                }
                else
                {
                    alert(response.message);
                }
            }
        }
    });
});

$('#danbooru_load').on('click', function () {
    var link = $('#danbooru_link').val().match(SITE_REGEX)[0];

    console.log("Trying to download image from post " + link);

    $.ajax(
        link + '.json',
        {
            success: function (data, status, xhr) {
                var side_size = Math.min(data.image_width, data.image_height);
                filename = data.file_url.substring(data.file_url.lastIndexOf('/') + 1);

                $('#tags_input').val(data.tag_string.replaceAll(' ', ', ').replaceAll('_', ' '));

                $('#main-cropper').croppie('bind', {
                    url: data.file_url,
                    viewport: { width: side_size, height: side_size },
                    boundary: { width: side_size, height: side_size },
                });

                draw_progress(data.file_url);
            },
            error(jqXhr, textStatus, errorMessage) {
                alert("Danbooru error: " + errorMessage);
            }
        }
    )
});

function draw_progress(file_url) {
    $.ajax(file_url, {
            progress: function (e) {
                if (e.lengthComputable) {
                    const completedPercentage = Math.round((e.loaded * 100) / e.total);

                    $('#loading_progress_background').removeClass("invisible");
                    $('#percent_text').text(completedPercentage + "%");

                    if(completedPercentage === 100) {
                        $('#loading_progress_background').addClass("invisible");
                    }

                    console.log(completedPercentage);
                }
            }
        }
    )
}

//rotate image
$('#rotate_left').on('click', function() {
    basic.croppie('rotate', 90);
});
$('#rotate_right').on('click', function() {
    basic.croppie('rotate', -90);
});

//mirror image
// $('#mirror_h').on('click', function() {
//     orientation_v = orientation_v === 1 ? 2 : 1
//
//     options.orientation = orientation_v
//
//     basic.croppie('bind', options);
// });