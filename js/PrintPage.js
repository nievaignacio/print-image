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
        var img = new PrintImage(this)
        img.src = src;
        this.area.content.appendChild(img);
        img.setAttribute('draggable', true);

        onclick = () => {
            console.log("selected" , img);
        this.selectImage(img);
    }
        // this.extendImg(img , {
        //     scale: "auto",
        //     mode: "fill",
        //     degree: 0,
        // });
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

