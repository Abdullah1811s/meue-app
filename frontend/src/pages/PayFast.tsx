import { useEffect } from "react";

const PayFastRedirect = () => {
    useEffect(() => {
        const form = document.getElementById("payfast-form") as HTMLFormElement;
        form?.submit();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-lg font-semibold mb-4">Redirecting to Payment...</h2>
            <form
                id="payfast-form"
                action="https://www.payfast.co.za/eng/process"
                method="post"
                className="hidden"
            >
                <input
                    type="hidden"
                    name="merchant_id"
                    value={import.meta.env.VITE_PAYFAST_MERCHANT_ID}
                />
                <input
                    type="hidden"
                    name="merchant_key"
                    value={import.meta.env.VITE_PAYFAST_MERCHANT_KEY}
                />
                <input type="hidden" name="amount" value="100.00" />
                <input type="hidden" name="item_name" value="Test Product" />
            </form>
        </div>
    );
};

export default PayFastRedirect;
