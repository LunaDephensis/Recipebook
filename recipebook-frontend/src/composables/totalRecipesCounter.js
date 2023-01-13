import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';

export function useGetTotalRecipesCount() {
    let route = useRouter();
    let totalRecipesCount = ref(0);

    onMounted(async () => {
            let resp = await fetch(`${process.env.BACKEND_URL}/recipes/totalCount`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });
            if(resp.ok) {
                let count = await resp.json();
                totalRecipesCount.value = count.count;
            }
            else {
                route.push({path: '/error'});
            }
    });

    return { totalRecipesCount }
}