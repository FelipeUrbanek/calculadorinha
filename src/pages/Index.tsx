import TimeCalculator from "@/components/TimeCalculator";
import { FeedbackForm } from "@/components/ui/feedback-form";
import { PixPayment } from "@/components/ui/pix-payment";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 fixed inset-0 w-full overflow-y-auto">
      <div className="container mx-auto py-4 sm:py-8">
        {/* Main Content */}
        <main>
          <TimeCalculator />
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <a
              href="https://felipeurbanek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo_felipe.svg"
                alt="Logo Felipe"
                className="h-16 w-auto"
              />
            </a>
            <p className="text-sm text-slate-600">
              Desenvolvido com muito ❤️ por{" "}
              <a
                href="https://felipeurbanek.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Felipe Urbanek
              </a>
            </p>
          </div>
        </footer>
      </div>

      {/* Botão PIX Flutuante */}
      <PixPayment />
      <FeedbackForm />
    </div>
  );
}
