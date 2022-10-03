let file;
let breeds = {}

$(() => {
    $.ajax({
        type : 'GET',
        url : '/getBreeds',
        success: (data) => {
            breeds = data.breeds;
            console.log(breeds);
            Object.keys(breeds[0]).map((item, index)=>{
                $('.breed-list').append(`
                    <li class="list-group-item">
                        <h1 class="display-5 fs-4">${breeds[0][item]}</h1>
                    </li>
                `);
            })
           
        },
        error:() => {   
            console.log('error');
        },
        complete: () => {
        }
    })
})

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
                $("#info").append(`
                    <h3>Result</h3>
                    <img src="${URL.createObjectURL(file)}" id="resultImg"/>
                `)
                for(i = 0; i < 3; i++){
                    $("#info").append(`
                        <h4>${JSON.parse(data)[i].Breed}</h4>
                        <div class="progress">
                            <br>
                            <div class="progress-bar bg-info" style="width:${(JSON.parse(data)[i].Confidence * 100).toFixed(2)}%">
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
        $("#overlay").css('display', 'none');
    }, 150)

    $('#info').html('<div class="loader"></div>')
}




