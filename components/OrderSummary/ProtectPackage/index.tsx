import { Checkbox } from "@/components/ui/Checkbox"

const ProtectPackage = ({ handleProtectionClick }: { handleProtectionClick: () => void }) => (
  <div className="flex items-center justify-between pt-4">
    <div className="flex items-center" onClick={handleProtectionClick}>
      <Checkbox />
      <label htmlFor="terms" className="ml-2 text-sm font-medium text-primary-900">
        Protect your package
      </label>
    </div>
    <div className="text-sm text-primary-900">$1.99</div>
  </div>
)

export default ProtectPackage
