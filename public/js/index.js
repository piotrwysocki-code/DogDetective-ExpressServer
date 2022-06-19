let file;

$(() => {
    $("#file-picker").on('change', () => {
        file = $("#file-picker").prop('files')[0]
        
        if (file) {
            $(".upload").attr('disabled', false)
            $("#selected-img").attr("src", URL.createObjectURL(file))
            console.log(URL.createObjectURL(file))
        }
    })

    $("#camera-picker").on('change', () => {
        file = $("#camera-picker").prop('files')[0]
        
        if (file) {
            $(".upload").attr('disabled', false)
            $("#selected-img").attr("src", URL.createObjectURL(file))
            console.log(URL.createObjectURL(file))
        }
    })
})

takePic = () => {
    $("#camera-picker").trigger('click')
}

pickPhoto = () => {
    $("#file-picker").trigger('click')
}

upload = (file) => {
    let formData = new FormData()
    formData.append("file", file)

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

            setTimeout(() => {
                $("#info").append(`<h3>Result</h3>`)
                for(i = 0; i < 3; i++){
                    $("#info").append(`
                        <hr>
                        <h4>${JSON.parse(data)[i].Breed}</h4>
                        <div class="progress">
                            <br>
                            <div class="progress-bar bg-success" style="width:${(JSON.parse(data)[i].Confidence * 100).toFixed(2)}%">
                                ${(JSON.parse(data)[i].Confidence * 100).toFixed(2)}
                            </div>
                        </div>
                    `)
                }
    
                $("#info").append(`<hr><button class='btn btn-warning' onClick='off()'>Done</button>`)
                $('#info').fadeIn('slow')
            }, 250)
        },
        complete: () => {
            console.log("complete")
        },
    })
}

on = () => {
    $("#overlay").fadeIn('slow')

    setTimeout(() => {
        $("#info").fadeIn('slow')
    }, 100)

    setTimeout(() => {
        $('.loader').fadeIn('slow')
    }, 200)
}

off = () => {
    $('.loader').hide('fast')

    $('#info').fadeOut('slow')

    setTimeout(() => {
        $("#overlay").fadeOut('slow')
    }, 150)

    $('#info').html('<div class="loader"></div>')
}




