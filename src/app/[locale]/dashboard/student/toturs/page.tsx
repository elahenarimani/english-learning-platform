import { getTotursServer } from "@/feature/dashboard/api/dashboard.api";
import Toturs from "@/feature/dashboard/components/toturs/Toturs";

export default async function TotursPage() {
  const toturs = await getTotursServer()
  return (
    <div>
      <Toturs data ={toturs || []}/>
    </div>
  );
}