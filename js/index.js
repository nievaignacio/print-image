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

    if (e.target.nodeName == "TD") {
        document.querySelector('#align .selected').classList.remove("selected");
        e.target.classList.add("selected");
    }

    if (e.target.classList.contains("top")) page.setVerticalAlign('top')
    if (e.target.classList.contains("middle")) page.setVerticalAlign('middle')
    if (e.target.classList.contains("bottom")) page.setVerticalAlign('bottom')
    if (e.target.classList.contains("left")) page.setAlign('left')
    if (e.target.classList.contains("center")) page.setAlign('center')
    if (e.target.classList.contains("right")) page.setAlign('right')

}


//add image

document.querySelector('input[type="file"]').addEventListener('change', function () {
    if (this.files && this.files[0]) {
        page.addImage(URL.createObjectURL(this.files[0]));
        console.log(this.files[0]);
        this.value = '';
    }
});

document.ondragover = (e) => {
    e.preventDefault()
};

document.querySelector('#page').ondrop = (e) => {
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
        document.querySelector('#scale').value = page.selectedImage.scale;
        document.querySelector('#mode').value = page.selectedImage.mode;
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

document.querySelector('#width').onkeyup = (event) => {
    if (event.keyCode === 13) {
        w = document.querySelector('#width').value;
        h = document.querySelector('#height').value;
        page.selectedImage.resize(w, h);
        page.selectedImage.setScale("Custom");
        document.querySelector('#width').value = page.selectedImage.getWidth();
        document.querySelector('#height').value = page.selectedImage.getHeight();
        document.querySelector('#scale').value = "Custom";
    }
}

document.querySelector('#height').onkeyup = (event) => {
    if (event.keyCode === 13) {
        w = document.querySelector('#width').value;
        h = document.querySelector('#height').value;
        page.selectedImage.resize(w, h);
        page.selectedImage.setScale("Custom");
        document.querySelector('#width').value = page.selectedImage.getWidth();
        document.querySelector('#height').value = page.selectedImage.getHeight();
        document.querySelector('#scale').value = "Custom";
    }
}

document.querySelector('#scale').addEventListener('change', function () {
    page.selectedImage.setScale(this.value);
    document.querySelector('#width').value = page.selectedImage.getWidth();
    document.querySelector('#height').value = page.selectedImage.getHeight();
    document.querySelector('#scale').value = page.selectedImage.scale;
});

//rotate

document.querySelector('#mode').addEventListener('change', function () {
    page.selectedImage.setMode(this.value);
    document.querySelector('#width').value = page.selectedImage.getWidth();
    document.querySelector('#height').value = page.selectedImage.getHeight();
    document.querySelector('#mode').value = page.selectedImage.mode;
});


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
    document.querySelector('#image-toolbar').setAttribute("style", "display:none;");
}

document.onkeydown = (event) => {
    if (event.key == "Delete" || event.key == "Backspace") {
        if (event.target.nodeName != "INPUT"){
            page.selectedImage.delete();
            document.querySelector('#image-toolbar').setAttribute("style", "display:none;");
        }
    }
}


//print

document.querySelector('#print').onclick = () => {
    window.print();
}