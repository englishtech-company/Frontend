import Swal from "sweetalert2";

type ConfirmDeleteOptions = {
  entityLabel: string;
  itemName: string;
  message?: string;
};

export async function confirmDelete(options: ConfirmDeleteOptions): Promise<boolean> {
  const { entityLabel, itemName, message } = options;

  const result = await Swal.fire({
    icon: "warning",
    title: `Excluir ${entityLabel}?`,
    text:
      message ??
      `Deseja remover "${itemName}"? Esta ação não pode ser desfeita.`,
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#600022",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
}
