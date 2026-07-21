import { ref, computed, onMounted } from "vue";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";

const { paginationLength } = storeToRefs(useStore());

export default function handlePagination(UserTable: any, pageNumber: number) {
  const page = ref(1);
  const data = ref();
  const perPage = ref(pageNumber);
  data.value = UserTable.map((item: any) => {
    return item;
  });

  const qtyshowPage = (num: number) => {
    perPage.value = num;
  };

  const searchData = (value: string) => {
    const searchName = value.toLowerCase();
    data.value = UserTable.filter((el: any) => el.name.toLowerCase().includes(searchName));
  };

  const addActive = ref(1);

  const paginatedData = computed(() => data.value.slice((page.value - 1) * perPage.value, page.value * perPage.value));

  const nextPage = () => {
    if (page.value !== Math.ceil(data.value.length / perPage.value)) {
      page.value += 1;
      addActive.value = page.value;
    }
    paginationLength.value = page.value * perPage.value;
    console.log(data.value, "nextpage");
  };

  const backPage = () => {
    if (page.value !== 1) {
      page.value -= 1;
      addActive.value = page.value;
    }
    perPage.value;
    paginationLength.value = page.value * perPage.value;
    console.log(data.value, "backpage");
  };

  const goToPage = (numPage: number) => {
    page.value = numPage;
    addActive.value = numPage;
    paginationLength.value = page.value * perPage.value;
    console.log(data.value, "gotopage");
  };

  const dataValue = ref(false);

  const sortingArr = (newIndex: number) => {
    if (newIndex) {
      let newType = Object.keys(data.value[0])[newIndex];
      dataValue.value = !dataValue.value;
      data.value.sort((a: any, b: any) => {
        return dataValue.value ? a[newType].localeCompare(b[newType]) : b[newType].localeCompare(a[newType]);
      });
    } else {
      return null;
    }
  };

  onMounted(() => {
    paginationLength.value = perPage.value;
  });

  return {
    data,
    paginatedData,
    perPage,
    page,
    nextPage,
    backPage,
    goToPage,
    searchData,
    addActive,
    sortingArr,
    qtyshowPage,
  };
}
