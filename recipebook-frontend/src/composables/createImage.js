export function useCreateImage() {
    let createImageURL = (image) => {
        if(!image) {
            return ''
        }
        let imgurl = `${process.env.VUE_APP_BACKEND_URL}/upload/${image}`
        return imgurl
    }
    return { createImageURL }
}