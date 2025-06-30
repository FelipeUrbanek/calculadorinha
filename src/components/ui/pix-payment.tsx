import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export function PixPayment() {
  const handlePixCopy = () => {
    navigator.clipboard.writeText("urbanekfelipe@gmail.com");
    const eventData: CustomEventData = {
      event: "pix_copy",
      pixType: "chave",
      location: window.location.pathname,
    };
    window.dataLayer?.push(eventData);
  };

  const handleQrCodeView = () => {
    const eventData: CustomEventData = {
      event: "pix_qr_view",
      location: window.location.pathname,
    };
    window.dataLayer?.push(eventData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white hover:bg-white/90 shadow-lg transition-all duration-200 hover:scale-105"
          onClick={handleQrCodeView}
          data-tracking="pix-floating-button"
        >
          <QrCode className="h-4 w-4" />
          <span>Apoie com PIX</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Apoie este projeto</DialogTitle>
          <DialogDescription className="text-center">
            Faça uma contribuição voluntária via PIX
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <img
              src="/qrcode-pix.png"
              alt="QR Code PIX"
              className="w-48 h-48 object-contain"
              data-tracking="pix-qr-code"
            />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Ou copie a chave PIX abaixo:
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                urbanekfelipe@gmail.com
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePixCopy}
                data-tracking="pix-copy-key"
              >
                Copiar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
