class PrintImage extends Image {
    
    scale = "auto";
    mode = "fill";
    degree = 0;
    orientation = 0;
    flip = 1;

    constructor(options){
        super();
        this.src = options.src;
        this.page = options.page;  
    
        
        this.setMode(options.mode || "fill");
        this.setScale(options.scale || "auto");
        if(options.scale == "Custom"){
            this.resize(options.width, options.height);
        }
        if(options.degree && options.degree > 0){
            this.resize(options.height, options.width);
            this.rotate(options.degree);
        } 

    }

    

    resize = (w, h) => {
        // console.log("resize ",this.src);
        if (this.orientation) {
            this.style.width = h * 10 + "mm";
            this.style.height = w * 10 + "mm";
        } else {
            this.style.width = w * 10 + "mm";
            this.style.height = h * 10 + "mm";
        }

        if (this.orientation) {
            this.orientation = 1;
            var marginV = (this.width - this.height) / 2;;
            var marginH = (this.height - this.width) / 2;;
        } else {
            this.orientation = 0;
            var marginV = marginH = 0;
        }

        this.style.margin = marginV + 'px ' + marginH + 'px ';

    }

    setScale = (value) => {
        switch (value) {
            case 'Original':
                this.restore();
                break;
            case 'auto':
                this.autoWidth();
                break;
            case '4x4':
                this.resize(4, 4);
                break;
            case '10x15':
                this.getHeight() < this.getWidth() ? this.resize(15, 10) : this.resize(10, 15);
                break;
            case '13x18':
                this.getHeight() < this.getWidth() ? this.resize(18, 13) : this.resize(13, 18);
                break;
            case '15x21':
                this.getHeight() < this.getWidth() ? this.resize(21, 15) : this.resize(15, 21);
                break;
            case '9x5':
                this.getHeight() < this.getWidth() ? this.resize(9, 5) : this.resize(5, 9);
                break;
            case 'postal':
                this.getHeight() < this.getWidth() ? this.resize(14.8, 10.5) : this.resize(10.5, 14.8);
                break;
            case 'Custom':
                break;
            default:
                this.restore();
        }
        this.scale = value;
    }

    setMode = (value) => {
        this.mode = value;
        this.style.objectFit = this.mode;
    }


    getWidth = () => { // return width at cm
        if (this.orientation)
            return (this.offsetHeight / (document.querySelector(this.page.selector).offsetHeight / this.page.size.height * 10)).toFixed(1);
        return (this.offsetWidth / (document.querySelector(this.page.selector).offsetWidth / this.page.size.width * 10)).toFixed(1);
    }

    getHeight = () => { // return height at cm
        if (this.orientation)
            return (this.offsetWidth / (document.querySelector(this.page.selector).offsetWidth / this.page.size.width * 10)).toFixed(1);
        return (this.offsetHeight / (document.querySelector(this.page.selector).offsetHeight / this.page.size.height * 10)).toFixed(1);
    }

    autoHeight = () => { // adjust height
        this.style.height = "100%";
    }

    autoWidth = () => {


        if (this.orientation) {

            this.style.width = this.page.area.offsetHeight + "px";
            this.style.height = "auto"

            var marginV = (this.width - this.height) / 2;
            var marginH = (this.height - this.width) / 2;
        } else {

            this.style.width = "100%";
            this.style.height = "auto";

            var marginV = marginH = 0;
        }

        this.style.margin = marginV + 'px ' + marginH + 'px ';
    }

    restore = () => { // restore
        //this.setAttribute("style", "");   
        this.style.width = "inherit";
        this.style.height = "inherit";

        if (this.orientation) {
            var marginV = (this.width - this.height) / 2;
            var marginH = (this.height - this.width) / 2;
        } else {
            var marginV = marginH = 0;
        }

        this.style.margin = marginV + 'px ' + marginH + 'px ';

    }


    delete = () => { // delete
        this.remove();
    }

    rotate = (degree) => {

        if ((this.degree % 180) == 0) {
            this.orientation = 1;
            var marginV = (this.width - this.height) / 2;;
            var marginH = (this.height - this.width) / 2;;
        } else {
            this.orientation = 0;
            var marginV = marginH = 0;
        }

        this.style.margin = marginV + 'px ' + marginH + 'px ';

        this.degree += degree;
        if(this.degree == 360) this.degree = 0;

        this.style.transform = 'rotate(' + this.degree + 'deg)';

        if (this.scale == "auto") {
            this.autoWidth();
        }
    }

    flip = () => {
        this.flip *= -1;
        this.style.transform = 'scale(' + this.flip + ')';
    }
}

customElements.define("print-image", PrintImage, {extends: 'img'}); 