var page = new Page('#page');

// page zoom 

window.onresize = () => {
    page.zoom();
}


//page size

document.querySelector('#size').addEventListener('change', function () {
    console.log(this.value);
    page.setSize(this.value);
});


//page margin

document.querySelector('#margin-normal').onclick = () => {
    page.setMargin(.1)
}

document.querySelector('#margin-narrow').onclick = () => {
    page.setMargin(.02)
}

//page align


document.querySelector('#align').onclick = (e) => {

    if(e.target.nodeName == "TD"){
        document.querySelector('#align .selected').classList.remove("selected");
        e.target.classList.add("selected");
    } 

    if(e.target.classList.contains("top")) page.setVerticalAlign('top')
    if(e.target.classList.contains("middle")) page.setVerticalAlign('middle')
    if(e.target.classList.contains("bottom")) page.setVerticalAlign('bottom')
    if(e.target.classList.contains("left")) page.setAlign('left')
    if(e.target.classList.contains("center")) page.setAlign('center')
    if(e.target.classList.contains("right")) page.setAlign('right')

}


//add image

document.querySelector('input[type="file"]').addEventListener('change', function () {
    console.log("Uploading...");
    if (this.files && this.files[0]) {
        page.addImage(URL.createObjectURL(this.files[0]));
        this.value = '';
    }
});

document.ondragover = (e) => {
    e.preventDefault()
};

document.querySelector('#page').ondrop =  (e) => {
    console.log(e.dataTransfer.files[0].name);
    e.stopPropagation();
    e.preventDefault();
    document.querySelector('input[type="file"]').files = e.dataTransfer.files;

   //  document.querySelector('input[type="file"]').dispatchEvent(new Event("change")); // colision with images drop 

}

//select & unselect

page.area.addEventListener('selected', function () {  // custom event
    //console.log("select");
    if (page.selectedImage) {
        document.querySelector('#image-toolbar').setAttribute("style", "display:block;");
        document.querySelector('#width').value = page.selectedImage.getWidth();
        document.querySelector('#height').value = page.selectedImage.getHeight();
    }
});

document.onclick = (e) => {
    if (document.querySelector('.selected') &&
        (document.querySelector('.selected').contains(e.target) ||
            document.querySelector('#image-toolbar').contains(e.target))) {
    } else {
        page.unSelectImage();
        document.querySelector('#image-toolbar').setAttribute("style", "display:none;");
    }
}


// resize

document.querySelector('#width').onkeyup= (event) => {
    if (event.keyCode === 13) {
        w = document.querySelector('#width').value;
        h = document.querySelector('#height').value;
        page.selectedImage.resize(w, h);
        document.querySelector('#width').value = page.selectedImage.getWidth();
        document.querySelector('#height').value = page.selectedImage.getHeight();
    }
}

document.querySelector('#height').onkeyup= (event) => {
    if (event.keyCode === 13) {
        w = document.querySelector('#width').value;
        h = document.querySelector('#height').value;
        page.selectedImage.resize(w, h);
        document.querySelector('#width').value = page.selectedImage.getWidth();
        document.querySelector('#height').value = page.selectedImage.getHeight();
    }
}

// document.querySelector('#resize').onclick = () => {
//     w = document.querySelector('#width').value;
//     h = document.querySelector('#height').value;
//     page.selectedImage.resize(w, h);
//     document.querySelector('#width').value = page.selectedImage.getWidth();
//     document.querySelector('#height').value = page.selectedImage.getHeight();
// }

document.querySelector('#size4x4').onclick = () => {
    page.selectedImage.resize(4, 4)
    document.querySelector('#width').value = page.selectedImage.getWidth();
    document.querySelector('#height').value = page.selectedImage.getHeight();
}

document.querySelector('#size10x15').onclick = () => {
    page.selectedImage.resize(10, 15)
    document.querySelector('#width').value = page.selectedImage.getWidth();
    document.querySelector('#height').value = page.selectedImage.getHeight();
}
document.querySelector('#size13x18').onclick = () => {
    page.selectedImage.resize(13, 18)
    document.querySelector('#width').value = page.selectedImage.getWidth();
    document.querySelector('#height').value = page.selectedImage.getHeight();
}
document.querySelector('#size15x21').onclick = () => {
    page.selectedImage.resize(15, 21)
    document.querySelector('#width').value = page.selectedImage.getWidth();
    document.querySelector('#height').value = page.selectedImage.getHeight();
}

document.querySelector('#autoWidth').onclick = () => {
    page.selectedImage.autoWidth();
}

// document.querySelector('#autoHeight').onclick = () => {
//     page.selectedImage.autoHeight();
// }

document.querySelector('#restore').onclick = () => {
    page.selectedImage.restore();
}



//rotate

document.querySelector('#rotate').onclick = () => {
    page.selectedImage.rotate(90);
    document.querySelector('#width').value = page.selectedImage.getWidth();
    document.querySelector('#height').value = page.selectedImage.getHeight();
}

//flip

// document.querySelector('#flip').onclick = () => {
//     page.selectedImage.flip();
// }

//duplicate

document.querySelector('#duplicate').onclick = () => {
    page.selectedImage.duplicate();
}

//remove

document.querySelector('#remove').onclick = () => {
    page.selectedImage.delete();
}

document.onkeydown = (event) => {
    if (event.key == "Delete" || event.key == "Backspace") {
        if(event.target.nodeName != "INPUT")
        page.selectedImage.delete();
    }
}


//print

document.querySelector('#print').onclick = () => {
    window.print();
}