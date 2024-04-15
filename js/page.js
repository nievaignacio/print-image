class Page {

    pageSizes = [
        { size: "A4", width: 210, height: 297 },
        { size: "A3", width: 297, height: 420 }
    ]


    constructor(ref) {

        console.log(this.pageSizes.find(size => size.size == "A4"));

        this.element = document.querySelector(ref);

        this.pageStyles = document.createElement('style');
        document.getElementsByTagName('HEAD')[0].appendChild(this.pageStyles);

        this.element.innerHTML = '<div id="area"><div id="content"></div></div>';
        this.element.area = document.getElementById("area");
        this.element.area.content = document.getElementById("content");

        this.setSize("A4");

    }


    setSpacing(value){
        // this.area.content.querySelector("img").style.border = value +"mm solid #fff;";
    }


    zoom() {
        var zoom = this.pxTocm(window.innerHeight - 160) / this.size.height;
        this.element.style.zoom = zoom;
    }

    pxTocm(px) {
        var hpx = this.element.offsetHeight;
        return (px / (hpx / this.size.height)).toFixed(1);
    };

    setSize(size) {
        this.size = this.pageSizes.find(s => s.size == size);
        this.element.style.width = this.size.width + "mm";
        this.element.style.height = this.size.height + "mm";
        this.setMargin(.1);
        this.zoom()
    }

    setMargin(margin) { //The margin is a percentage of A4

        console.log(this.size);

        var marginH = (this.pageSizes[0].width * margin);
        var marginV = (this.pageSizes[0].height * margin);

        console.log(marginH, marginV);

        this.element.area.style.margin = marginV + "mm " + marginH + "mm";

        this.element.area.style.width = (this.size.width - (marginH * 2)) + "mm";
        this.element.area.style.height = (this.size.height - (marginV * 2)) + "mm";

        this.element.area.style.lineHeight = (this.size.height - (marginV * 2)) + "mm";

        this.pageStyles.textContent = "@media print { @page { size: " + this.size.size + " !important; margin:" + marginV + "mm " + marginH + "mm }}";
    }

    setAlign(align) {
        this.element.area.style.textAlign = align;
    }

    setVerticalAlign(align) {
        this.element.area.content.style.verticalAlign = align;
    }

    addImage(src) {
        var img = document.createElement("img");
        img.src = src;
        this.element.area.content.appendChild(img);
        img.setAttribute('draggable', true);
        this.extendImg(img , {
            scale: "auto",
            mode: "fill",
            degree: 0,
            keep_ratio: true,
        });
    }

    extendImg(img, options = {}) { // # private method not support firefox

        img.scale = options.scale || "Original"
        img.mode = options.mode || "fill"
        img.degree = options.degree || 0;
        img.orientation = options.orientation || 0;
        img.flip = options.flip || 1;
        img.keep_ratio = options.keep_ratio || true;
        

        img.onload = () => {
            img.setScale(options.scale);
        }

        img.onclick = () => {
            this.selectImage(img);
        }

        img.ondrag = (item) => {
            const selectedItem = item.target,
                list = selectedItem.parentNode,
                x = event.clientX,
                y = event.clientY;

            selectedItem.classList.add('drag-sort-active');
            let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);

            if (list === swapItem.parentNode) {
                swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
                list.insertBefore(selectedItem, swapItem);
            }
        }

        img.ondragend = (item) => {
            item.target.classList.remove('drag-sort-active');
        }

        img.setMargin = () =>{

            if (img.orientation) {
                img.orientation = 1;
                var marginV = (img.width - img.height) / 2;
                var marginH = (img.height - img.width) / 2;
            } else {
                img.orientation = 0;
                var marginV = marginH = 0;
            }

            img.style.margin = marginV + 'px ' + marginH + 'px ';
        }

        img.resize = (w, h) => {
            // console.log("resize ",img.src);

            if(img.getWidth() != w && img.getHeight() != h){
                img.keep_ratio  = false;
            }else if(img.getWidth() != w && img.keep_ratio){
                h = (img.getHeight()/img.getWidth()) * w;
            }else if(img.getHeight() != h && img.keep_ratio){
                w = (img.getWidth()/img.getHeight()) * h;
            }

            if (img.orientation) {
                img.style.width = h * 10 + "mm";
                img.style.height = w * 10 + "mm";
            } else {
                img.style.width = w * 10 + "mm";
                img.style.height = h * 10 + "mm";
            }

            img.setMargin();

        }


        img.setScale = (value) => {
            switch (value) {
                case 'Original':
                    img.restore();
                    break;
                case 'auto':
                    img.autoWidth();
                    break;
                case '4x4':
                    img.resize(4, 4);
                    break;
                case '10x15':
                    img.getHeight() < img.getWidth() ? img.resize(15, 10) : img.resize(10, 15);
                    break;
                case '13x18':
                    img.getHeight() < img.getWidth() ? img.resize(18, 13) : img.resize(13, 18);
                    break;
                case '15x21':
                    img.getHeight() < img.getWidth() ? img.resize(21, 15) : img.resize(15, 21);
                    break;
                case '9x5':
                    img.getHeight() < img.getWidth() ? img.resize(9, 5) : img.resize(5, 9);
                    break;
                case 'postal':
                    img.getHeight() < img.getWidth() ? img.resize(14.8, 10.5) : img.resize(10.5, 14.8);
                    break;
                case 'Custom':
                    break;
                default:
                    img.restore();
            }
            img.scale = value;
        }

        img.setMode = (value) => {
            img.mode = value;
            img.style.objectFit = img.mode;
        }

        img.duplicate = () => {
            // console.log("duplicate ",this);
            var imgClon = img.cloneNode(true) // Clona the element with its classes
            imgClon.classList.remove("selected");
            this.element.area.content.insertBefore(imgClon, img);
            this.extendImg(imgClon , {
                scale : img.scale,
                mode : img.mode,
                degree : img.degree,
                orientation : img.orientation,
                flip : img.flip,
                keep_ratio : img.keep_ratio,
            });
        }

        img.getWidth = () => { // return width at cm
            if (img.orientation)
                return (img.offsetHeight / (this.element.offsetHeight / this.size.height * 10)).toFixed(1);
            return (img.offsetWidth / (this.element.offsetWidth / this.size.width * 10)).toFixed(1);
        }

        img.getHeight = () => { // return height at cm
            if (img.orientation)
                return (img.offsetWidth / (this.element.offsetWidth / this.size.width * 10)).toFixed(1);
            return (img.offsetHeight / (this.element.offsetHeight / this.size.height * 10)).toFixed(1);
        }

        img.autoHeight = () => { // adjust height
            img.style.height = "100%";
        }

        img.autoWidth = () => {


            if (img.orientation) {

                img.style.width = this.element.area.offsetHeight + "px";
                img.style.height = "auto"

            } else {

                img.style.width = "100%";
                img.style.height = "auto";

                // var marginV = marginH = 0;
            }

            img.setMargin();
 //img.style.margin = marginV + 'px ' + marginH + 'px ';
        }

        img.restore = () => { // restore
            //img.setAttribute("style", "");   
            img.style.width = "inherit";
            img.style.height = "inherit";

            img.setMargin();

        }


        img.delete = () => { // delete
            this.unSelectImage();
            img.remove();
        }

        img.rotate = (degree) => {

            (img.degree % 180) == 0? img.orientation = 1 : img.orientation = 0;

           img.setMargin();


            img.degree += degree;
            if(img.degree == 360) img.degree = 0;

            img.style.transform = 'rotate(' + img.degree + 'deg)';

            if (img.scale == "auto") {
                img.autoWidth();
            }
        }

        img.flip = () => {
            img.flip *= -1;
            img.style.transform = 'scale(' + img.flip + ')';
        }


    }

    selectImage(img) {
        this.unSelectImage();
        this.selectedImage = img;
        this.selectedImage.classList.add("selected");

        const event = new Event("selected");
        this.element.dispatchEvent(event);
    }

    unSelectImage() {
        if (this.selectedImage != null)
            this.selectedImage.classList.remove("selected");
        this.selectedImage = null;
    }


}




