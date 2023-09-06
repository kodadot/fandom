interface ProductActionProps {
  id: string;
}

export default function ProductAction(props: ProductActionProps) {
  return (
    <a
      href={`https://kodadot.xyz/ahk/gallery/${props.id}`}
      class={`w-full bg-gray-700 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-900`}
      target={'_blank'}
    >
      Visit on Kodadot
    </a>
  );
}
