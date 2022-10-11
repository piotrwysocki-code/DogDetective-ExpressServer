let breeds = {}

$(() => {
    $.ajax({
        type : 'GET',
        url : '/getBreeds',
        success: (data) => {
            breeds = data.breeds;
            console.log(breeds);
            Object.keys(breeds[0]).map((item, index)=>{
                let temp = breeds[0][item].replace(/_/g, " ").toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
                $('.breed-list').append(`
                    <li class="list-group-item">
                        ${temp}
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

$("#searchInput").on('input', () => {
    console.log($("#searchInput").val())
    if($("#searchInput").val() !== ""){
        $('.breed-list').html(``);
        Object.keys(breeds[0]).map((item, index)=>{
            if(breeds[0][item].toUpperCase().includes($("#searchInput").val().toUpperCase())){
                let temp = breeds[0][item].replace(/_/g, " ").toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
                $('.breed-list').append(`
                    <li class="list-group-item">
                        ${temp}
                    </li>
                `);
            }else{
                
            }
        })
    }else{
        Object.keys(breeds[0]).map((item, index)=>{
            let temp = breeds[0][item].replace(/_/g, " ").toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
            $('.breed-list').append(`
                <li class="list-group-item">
                    ${temp}
                </li>
            `);
        })
    }
})
