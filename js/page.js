class Page {

    pageSizes = [
        { size: "A4", width: 210, height: 297 },
        { size: "A3", width: 297, height: 420 }
    ]


    constructor(ref) {

        console.log(this.pageSizes.find(size => size.size == "A4"));

        this.selector = ref;

        this.pageStyles = document.createElement('style');
        //this.pageStyles.textContent ="@media print { @page { size: A4; margin: 10%; }}";
        document.getElementsByTagName('HEAD')[0].appendChild(this.pageStyles);

        this.area = document.createElement("div");


        // this.setMargin(.1);

        this.area.id = "area";
        document.querySelector(ref).appendChild(this.area);

        this.area.content = document.createElement("div");
        this.area.content.id = "content";
        this.area.appendChild(this.area.content);

        this.setSize("A4");

    }


    zoom() {
        var zoom = this.pxTocm(window.innerHeight - 160) / this.size.height;
        document.querySelector(this.selector).style.zoom = zoom;
    }

    pxTocm(px) {
        var hpx = document.querySelector(this.selector).offsetHeight;
        return (px / (hpx / this.size.height)).toFixed(1);
    };

    setSize(size) {
        this.size = this.pageSizes.find(s => s.size == size);
        document.querySelector(this.selector).style.width = this.size.width + "mm";
        document.querySelector(this.selector).style.height = this.size.height + "mm";
        this.setMargin(.1);
        this.zoom()
    }

    setMargin(margin) { //The margin is a percentage of A4

        console.log(this.size);

        var marginH = (this.pageSizes[0].width * margin);
        var marginV = (this.pageSizes[0].height * margin);

        console.log(marginH, marginV);

        this.area.style.margin = marginV + "mm " + marginH + "mm";

        this.area.style.width = (this.size.width - (marginH * 2)) + "mm";
        this.area.style.height = (this.size.height - (marginV * 2)) + "mm";

        this.area.style.lineHeight = (this.size.height - (marginV * 2)) + "mm";

        this.pageStyles.textContent = "@media print { @page { size: " + this.size.size + " !important; margin:" + marginV + "mm " + marginH + "mm }}";
    }

    setAlign(align) {
        this.area.style.textAlign = align;
    }

    setVerticalAlign(align) {
        this.area.content.style.verticalAlign = align;
    }

    addImage(src) {
        var img = document.createElement("img");
        img.src = src;
        this.area.content.appendChild(img);
        img.setAttribute('draggable', true);
        this.extendImg(img);
    }

    extendImg(img) { // # private method not support firefox

        img.scale = "Original"
        img.mode = "fill"
        img.degree = 0;
        img.orientation = 0;
        img.flip = 1;

        img.onload = () => {
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

        img.resize = (w, h) => {
            // console.log("resize ",img.src);
            if (img.orientation) {
                img.style.width = h * 10 + "mm";
                img.style.height = w * 10 + "mm";
            } else {
                img.style.width = w * 10 + "mm";
                img.style.height = h * 10 + "mm";
            }

            if (img.orientation) {
                img.orientation = 1;
                var marginV = (img.width - img.height) / 2;;
                var marginH = (img.height - img.width) / 2;;
            } else {
                img.orientation = 0;
                var marginV = marginH = 0;
            }

            img.style.margin = marginV + 'px ' + marginH + 'px ';

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
            this.area.content.insertBefore(imgClon, img);
            this.extendImg(imgClon);
            imgClon.scale = img.scale;
            imgClon.mode = img.mode;
            imgClon.degree = img.degree;
            imgClon.orientation = img.orientation;
            imgClon.flip = img.flip;
        }

        img.getWidth = () => { // return width at cm
            if (img.orientation)
                return (img.offsetHeight / (document.querySelector(this.selector).offsetHeight / this.size.height * 10)).toFixed(1);
            return (img.offsetWidth / (document.querySelector(this.selector).offsetWidth / this.size.width * 10)).toFixed(1);
        }

        img.getHeight = () => { // return height at cm
            if (img.orientation)
                return (img.offsetWidth / (document.querySelector(this.selector).offsetWidth / this.size.width * 10)).toFixed(1);
            return (img.offsetHeight / (document.querySelector(this.selector).offsetHeight / this.size.height * 10)).toFixed(1);
        }

        img.autoHeight = () => { // adjust height
            img.style.height = "100%";
        }

        img.autoWidth = () => {


            if (img.orientation) {

                img.style.width = this.area.offsetHeight + "px";
                img.style.height = "auto"

                var marginV = (img.width - img.height) / 2;
                var marginH = (img.height - img.width) / 2;
            } else {

                img.style.width = "100%";
                img.style.height = "auto";

                var marginV = marginH = 0;
            }

            img.style.margin = marginV + 'px ' + marginH + 'px ';
        }

        img.restore = () => { // restore
            //img.setAttribute("style", "");   
            img.style.width = "inherit";
            img.style.height = "inherit";

            if (img.orientation) {
                var marginV = (img.width - img.height) / 2;
                var marginH = (img.height - img.width) / 2;
            } else {
                var marginV = marginH = 0;
            }

            img.style.margin = marginV + 'px ' + marginH + 'px ';

        }


        img.delete = () => { // delete
            this.unSelectImage();
            img.remove();
        }

        img.rotate = (degree) => {

            if ((img.degree % 180) == 0) {
                img.orientation = 1;
                var marginV = (img.width - img.height) / 2;;
                var marginH = (img.height - img.width) / 2;;
            } else {
                img.orientation = 0;
                var marginV = marginH = 0;
            }

            img.style.margin = marginV + 'px ' + marginH + 'px ';

            img.degree += degree;
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
        this.area.dispatchEvent(event);
    }

    unSelectImage() {
        if (this.selectedImage != null)
            this.selectedImage.classList.remove("selected");
        this.selectedImage = null;
    }


}