
const vm = {
    data() {
        return {
            fileName: "",
            isSelected: {
                unprocessed: true,
                averageMethod: true,
                weightedAverageMethod: true,
                luminosityMethod: true,
            },
            imageSrc: "https://picsum.photos/800/400",
            isProcessing: false,
            errorMessage: "",
        }
    },
    mounted() {
        // this.imageSrc = "images/clover_days.jpg";
        // this.imageSrc = "images/2.jpg";
        // this.imageSrc = "images/しもんきん.jpg";
        this.updateAllCanvas();
    },
    methods: {
        onClickRandomImageButton() {
            this.imageSrc = "https://picsum.photos/800/400";
            this.updateAllCanvas();
        },
        onClickFileButton() {
            this.$refs.fileInput.value = "";
            this.$refs.fileInput.click();
        },
        onChangeFile(e) {
            const file = e.target.files[0];
            if (file == null) {
                return;
            }
            this.fileName = file.name;
            this.imageSrc = URL.createObjectURL(file);
            this.updateAllCanvas();
        },
        loadImage() {
            const image = new Image();
            image.setAttribute("crossorigin", "anonymous");
            return new Promise((resolve, reject) => {
                image.onload = () => {
                    URL.revokeObjectURL(this.imageSrc);
                    resolve(image);
                };
                image.onerror = e => {
                    URL.revokeObjectURL(this.imageSrc);
                    reject(e);
                };
                image.src = this.imageSrc;
            });
        },
        async updateAllCanvas() {
            this.isProcessing = true;
            let image = undefined;
            this.errorMessage = "";
            try {
                image = await this.loadImage();
            }
            catch (e) {
                this.errorMessage = "エラー！本当に画像？";
                this.isProcessing = false;
                return;
            }
            const isValidCanvas = canvasSize.test({
                width : image.width,
                height: image.height
            });
            if (!isValidCanvas) {
                this.errorMessage = "画像がでかすぎます…";
                this.isProcessing = false;
                return;
            }

            this.updateCanvas(
                this.$refs.unprocessedCanvas,
                image,
                this.applyUnprocessed
            );
            this.updateCanvas(
                this.$refs.averageMethodCanvas,
                image,
                this.applyAverageMethod
            );
            this.updateCanvas(
                this.$refs.weightedAverageMethodCanvas,
                image,
                this.applyWeightedAverageMethod
            );
            this.updateCanvas(
                this.$refs.luminosityMethodCanvas,
                image,
                this.applyLuminosityMethod
            );

            // 2つ並びにする。8はcolumn-gap
            this.$refs.resultContainer.style.maxWidth = `${this.$refs.unprocessedCanvas.width * 2 + 8}px`;
            
            this.isProcessing = false;
        },
        updateCanvas(canvas, image, applyMethod) {
            const context = canvas.getContext("2d", {willReadFrequently: true});
            const maxCanvasWidth = 500;
            const canvasWidth = image.width < maxCanvasWidth ? image.width : maxCanvasWidth;
            canvas.width = canvasWidth;
            canvas.height = image.height * (canvasWidth / image.width);
            canvas.style.maxWidth = `${image.width}px`;
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            applyMethod(imageData);
            context.putImageData(imageData, 0, 0);
        },
        applyUnprocessed(imageData) {
            // 何もしない
        },
        applyAverageMethod(imageData) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const red   = data[i];
                const green = data[i + 1];
                const blue  = data[i + 2];
                const grayscaleValue = (red + green + blue) / 3;
                data[i]     = grayscaleValue;
                data[i + 1] = grayscaleValue;
                data[i + 2] = grayscaleValue;
            }
        },
        applyWeightedAverageMethod(imageData) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const red   = data[i];
                const green = data[i + 1];
                const blue  = data[i + 2];
                const grayscaleValue = 0.2989 * red + 0.5870 * green + 0.1140 * blue;
                data[i]     = grayscaleValue;
                data[i + 1] = grayscaleValue;
                data[i + 2] = grayscaleValue;
            }
        },
        applyLuminosityMethod(imageData) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const red   = data[i];
                const green = data[i + 1];
                const blue  = data[i + 2];
                const grayscaleValue = 0.21 * red + 0.72 * green + 0.07 * blue;
                data[i]     = grayscaleValue;
                data[i + 1] = grayscaleValue;
                data[i + 2] = grayscaleValue;
            }
        },
    }
};

Vue.createApp(vm).mount('#app');
