$(() => {
    $("#file-picker").on('change', () => {
        let file = $("#file-picker").prop('files')[0]
        
        if (file) {
            $(".upload").attr('disabled', false)
            $("#selected-img").attr("src", URL.createObjectURL(file))
            console.log(URL.createObjectURL(file))
        }
    })

    $("#camera-picker").on('change', () => {
        let file = $("#file-picker").prop('files')[0]
        
        if (file) {
            $(".upload").attr('disabled', false)
            $("#selected-img").attr("src", URL.createObjectURL(file))
            console.log(URL.createObjectURL(file))
        }
    })
});

takePic = () => {
    $("#camera-picker").trigger('click')
}

pickPhoto = () => {
    $("#file-picker").trigger('click')
}

upload = () => {
    let formData = new FormData(); 
    formData.append("file", $("#file-picker").prop('files')[0]);

    $.ajax({
        type : 'POST',
        url : 'http://localhost:4000/upload',
        data: formData,
        contentType: false,
        processData: false,
        success: (data) => {
            $('#result').html('')
            for(i = 0; i < 3; i++){
                $("#result").append(`Breed: ${JSON.parse(data)[i].Breed}, Confidence: ${JSON.parse(data)[i].Confidence} / 1.0 </br>`)
            }
        },
        complete: () => {
            console.log("complete")
        }
    })
}




