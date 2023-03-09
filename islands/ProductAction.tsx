interface ProductActionProps {
  id: string;
}

export default function ProductAction(props: ProductActionProps) {
  const add = (e: MouseEvent) => {
    e.preventDefault();
    const url = `https://kodadot.xyz/bsx/gallery/${props.id}`;
    window.open(url, '_blank')
  };

  return (
    <button
      onClick={add}
      class={`w-full bg-gray-700 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-900`}
    >
      Visit on Kodadot
    </button>
  );
}
