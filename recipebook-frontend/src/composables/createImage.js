export function useCreateImage() {
    let createImageURL = (image) => {
        if(!image) {
            return ''
        }
        let imgurl = `http://localhost:3000/upload/${image}`
        return imgurl
    }
    return { createImageURL }
}