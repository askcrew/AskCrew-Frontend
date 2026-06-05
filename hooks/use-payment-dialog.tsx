import { parseAsBoolean, useQueryState } from "nuqs"

const usePaymentDialog = () => {
	const [isOpen, setIsOpen] = useQueryState("payment-dialog", parseAsBoolean)

	return { isOpen: isOpen || false, setIsOpen: (value: boolean | undefined) => setIsOpen(value || false) }
}
export default usePaymentDialog