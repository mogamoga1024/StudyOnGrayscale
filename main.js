
const vm = {
    data() {
        return {
        }
    },
    mounted() {
        const image = new Image();
        image.onload = () => {
            const canvas = this.$refs.canvas;
            const context = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            this.monochromeEx(imageData);
            context.putImageData(imageData, 0, 0);
        };
        // image.src = "images/clover_days.jpg";
        image.src = "images/2.jpg";
        // image.src = "images/しもんきん.jpg";
    },
    methods: {
        monochromeEx(imageData) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const red   = data[i];
                const green = data[i + 1];
                const blue  = data[i + 2];
                const max = Math.max(red, green, blue);
                const average = (red + green + blue) / 3;
                data[i]     = average;
                data[i + 1] = average;
                data[i + 2] = average;
                continue;
                if (red === green && green === blue) {
                    data[i]     = average;
                    data[i + 1] = average;
                    data[i + 2] = average;
                }
                else if (max === red && max === green) {
                    data[i]     = average;
                    data[i + 1] = average;
                    data[i + 2] = 0xFF;
                }
                else if (max === red && max === blue) {
                    data[i]     = average;
                    data[i + 1] = 0xFF;
                    data[i + 2] = average;
                }
                else if (max === green && max === blue) {
                    data[i]     = 0xFF;
                    data[i + 1] = average;
                    data[i + 2] = average;
                }
                else if (max === red) {
                    data[i]     = average;
                    data[i + 1] = 0xFF;
                    data[i + 2] = 0xFF;
                }
                else if (max === green) {
                    data[i]     = 0xFF;
                    data[i + 1] = average;
                    data[i + 2] = 0xFF;
                }
                else if (max === blue) {
                    data[i]     = 0xFF;
                    data[i + 1] = 0xFF;
                    data[i + 2] = average;
                }
                else {
                    throw new Error("このエラーが発生した場合、分岐に見落としがある。");
                }
            }
        }
    }
};

Vue.createApp(vm).mount('#app');
