import { useStore } from "~/store";

interface Props {
  isVisible: Ref<boolean>;
}

export default function useAppModal(props: Props) {
  const store = useStore();
  const ID = Math.floor(Math.random() * 1_000_000);

  const isVisible = props?.isVisible;

  if (isVisible) {
    watch(
      isVisible,
      (val: boolean) => {
        if (val) {
          store.addActiveModal(ID);
        } else {
          store.removeActiveModal(ID);
        }
      },
      {
        immediate: true
      }
    );
  }

  return { ID };
}
