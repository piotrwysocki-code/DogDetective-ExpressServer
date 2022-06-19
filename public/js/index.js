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
            $('#info').html('')
            $('.loader').hide('fast')
            $("#info").append(`<h3>Result</h3>`)
            for(i = 0; i < 3; i++){
                $("#info").append(`Breed: ${JSON.parse(data)[i].Breed} <br> Confidence: ${JSON.parse(data)[i].Confidence} / 1.0 <hr>`)
            }

            $("#info").append(`<button class='btn btn-warning' onClick='off()'>Done</button>`)

            $('#result').show('fast')
        },
        complete: () => {
            console.log("complete")
        },
    })
}

on = () => {
    $("#overlay").show('slow')
}

off = () => {
    $("#overlay").hide('slow')
}




