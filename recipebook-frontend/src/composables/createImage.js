export function useCreateImage() {
    let createImageURL = (image) => {
        if(!image) {
            return ''
        }
        let imgurl = `${process.env.BACKEND_URL}/upload/${image}`
        return imgurl
    }
    return { createImageURL }
}