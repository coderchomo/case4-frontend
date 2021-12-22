getCities()
getNation("nation")

function getCities() {
    $.ajax({
        url: "http://localhost:8080/cities/list",
        type: "GET",
        success: function (data) {
            let content = ``
            for (let i = 0; i < data.content.length; i++) {
                content += getCity(data.content[i]);
            }
            document.getElementById("tbodyId").innerHTML = content;
            document.getElementById("page").innerHTML = getPage(data);
            document.getElementById("item").innerText = data.totalElements + ' item';
        }
    })
}

function getCity(city) {
    return `<tr></tr><td>` +
        `<span class="custom-checkbox">` +
        `<input type="checkbox" id="checkbox1" name="options[]" value="1">` +
        `<label htmlFor="checkbox1"></label>` +
        `</span>` +
        `</td>` +
        `<td>${city.cityName}</td>` +
        `<td>${city.nation.nationName}</td>` +
        `<td>${city.cityPopulation}</td>` +
        `<td>${city.cityArea}</td>` +
        `<td>${city.cityGDP}</td>` +
        `<td>${city.description}</td>` +
        `<td>` +
        `<a href="#editCityModal" onclick="editForm(this)" id="${city.id}" class="edit" data-toggle="modal"><i class="material-icons"` +
        `data-toggle="tooltip"` +
        `title="Edit">&#xE254;</i></a>` +
        `<a href="#deleteCityModal" onclick="getFormDelete(this)" id="${city.id}" class="delete" data-toggle="modal"><i class="material-icons"` +
        `data-toggle="tooltip"` +
        `title="Delete">&#xE872;</i></a>` +
        `</td></tr>`
}

function getNation(id,nationId) {
    $.ajax({
        url: "http://localhost:8080/cities/nation/list",
        type: "GET",
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.length; i++) {
                if(data[i].id===nationId){
                    content+=`<option selected value="${data[i].id}">${data[i].nationName}</option>`
                }else{
                    content += `<option value="${data[i].id}">${data[i].nationName}</option>`
                }
            }
            document.getElementById(id).innerHTML = content;
        }
    })
}





function createCity() {
    let name = $("#name").val();
    let nation = $("#nation").val();
    let population = $("#population").val();
    let area = $("#area").val();
    let gdp = $("#gdp").val();
    let description = $("#description").val();
    let formData = new FormData;
    let city = {
        cityName: name,
        cityArea: area,
        cityPopulation:population,
        cityGDP:gdp,
        description: description,
        nation: {
            id: nation
        },
    }
    formData.append("book",JSON.stringify(city))
    $.ajax({
        type:"POST",
        url: "http://localhost:8080/cities/create",
        data: formData,
        headers:{'Content-Type':undefined},
        contentType: false,
        processData: false,
        success:getCities()
    });
    $('#addCityModal').modal('hide');
    event.defaultPrevented
}
function editCity(){

    let id = $('#id').val();
    let name=$("#name2").val();
    let nation=$("#editNation").val();
    let population=$("#editPopulation").val();
    let area=$("#editArea").val();
    let gdp = $('#editGdp').val();
    let description=$("#editDescription").val();
    let city = {
        cityName: name,
        cityArea: area,
        cityPopulation:population,
        cityGDP:gdp,
        description: description,
        nation: {
            id: nation
        },
    }
    if ($("#file2").val() != ''){
        let formData = new FormData;
        formData.append("city",JSON.stringify(city))
        $.ajax({
            type:"POST",
            url: "http://localhost:8080/cities/create",
            data: formData,
            headers:{'Content-Type':undefined},
            contentType: false,
            processData: false,
            success:getCities
        });

    }
    else {
        $.ajax({
            type:"PUT",
            url: "http://localhost:8080/cities/update",
            data:JSON.stringify(city),
            headers:{
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            success:getCities
        })
    }
    $('#editCityModal').modal('hide');
    event.defaultPrevented

}
function editForm(a){
    let id=a.getAttribute("id");
    $.ajax({
        type:"GET",
        url:"http://localhost:8080/cities/find/"+ id,
        headers: {

        },
        success: function (data){
            getNation('editNation',data.nation.id);
            document.getElementById('editID').innerHTML = `<input id="id" value="${data.id}" type="text" class="form-control" hidden>`;
            document.getElementById('editName').innerHTML = `<label>Name</label><input id="name2" value="${data.cityName}" type="text" class="form-control" required>`
            document.getElementById('editPopulation').innerHTML = `<label>Population</label>`+
            `<input id="population2" value="${data.cityPopulation}" type="number" class="form-control" required>`
            document.getElementById('editGdp').innerHTML = `<label>GDP</label>` +
                `<input id="gdp2"  type="file" class="form-control" required>`
            document.getElementById('editDescription').defaultValue = data.description;

        }
    })
}

function getFormDelete(a){
    let id = a.getAttribute("id");
    let content = `<input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">`+
        `<input type="submit" href="` +id+ `" onclick="deleteCity(this)" class="btn btn-danger" value="Delete">`
    document.getElementById('delete').innerHTML = content;
}
function deleteCity(a){
    let id = a.getAttribute("href");
    $.ajax({
        type:"DELETE",
        url:'http://localhost:8080/cities/delete/' + id,
        success:getCities
    })
    $('#deleteCityModal').modal('hide');
    event.preventDefault();
}
