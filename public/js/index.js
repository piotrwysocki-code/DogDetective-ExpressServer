let file;

$("#file-picker").on('change', () => {
    fileList = $("#file-picker").prop('files')
    getImage(fileList)
})

$("#camera-picker").on('change', () => {
    fileList = $("#camera-picker").prop('files')
    getImage(fileList)
})

getImage = (fileList) => {    
    tempFile = fileList[0]
    if (tempFile) {
        file = tempFile;
        $(".upload").attr('disabled', false)
        $("#selected-img").attr("src", URL.createObjectURL(file))
        console.log(URL.createObjectURL(file))
    }
    else{
        console.log("No File Selected");
    }
}

takePic = () => {
    $("#camera-picker").trigger('click')
}

pickPhoto = () => {
    $("#file-picker").trigger('click')
}

upload = () => {
    let formData = new FormData()
    formData.append("file", file)

    console.log(file);

    $.ajax({
        type : 'POST',
        url : '/upload',
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: () => {
            on()
        },
        success: (data) => {
            $('.loader').fadeOut('fast')
            $('#info').fadeOut('fast')
            //<img src="${URL.createObjectURL(file)}" id="resultImg"/>

            setTimeout(() => {
                $("#info").append(`
                    <h3>Result</h3>
                    <hr>
                `)
                for(i = 0; i < 3; i++){
                    $("#info").append(`
                        <h4>${JSON.parse(data)[i].Breed.replace(/_/g, " ").toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</h4>
                        <div class="progress">
                            <br>
                            <div class="progress-bar bg-info" style="width:${(JSON.parse(data)[i].Confidence * 100).toFixed(2)}%">
                                ${(JSON.parse(data)[i].Confidence * 100).toFixed(2)}%
                            </div>
                        </div>
                    `)
                }
    
                $("#info").append(`<hr><button class='btn btn-lg btn-warning' onClick='off()'>Done</button>`)
                $('#info').fadeIn('slow')
            }, 250)

            console.log(data);
        },
        complete: () => {
            console.log("complete")
        },
    })
}

on = () => {

    $("#magnify-img").hide()
    $("#investigate-btn").hide()

    setTimeout(() => {
        $("#info").fadeIn('slow')
        $("#info").addClass(`
            d-flex flex-column justify-content-center align-items-center
        `);
    }, 100)

    setTimeout(() => {
        $('.loader').fadeIn('slow')
    }, 200)


}

off = () => {
    $('.loader').hide()

    $('#info').hide()

    $("#magnify-img").fadeIn()
    $("#investigate-btn").fadeIn()

    $("#info").removeClass(`
        d-flex flex-column justify-content-center align-items-center
    `);

    setTimeout(() => {
        $('#info').html(`
            <div
                class="spinner-border text-info loader"
                style="height: 3rem; width: 3rem"
                role="status"
            >
                <span class="visually-hidden">Loading...</span>
            </div>`
        )
    }, 200)

    
}




