import {ref, onMounted} from 'vue'

export function useGetTotalRecipesCount() {
    let totalRecipesCount = ref(0);

    onMounted(async () => {
        let token = localStorage.getItem('token');
            let resp = await fetch(`${process.env.BACKEND_URL}/recipes/totalCount`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            let count = await resp.json();
        totalRecipesCount.value = count.count;
    });

    return { totalRecipesCount }
}