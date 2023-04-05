import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import StyledComponentsRegistry from './styled';
import { PromptSection } from './PromptSection';

export const metadata = {
  title: 'gpt-calendar',
  description: 'let ai build your calendar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          {children}
          <input type="checkbox" id="my-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box w-[350px]">
              <PromptSection />
              <div className="modal-action">
                <label htmlFor="my-modal" className="btn">Close</label>
              </div>
            </div>
          </div>
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  )
}
