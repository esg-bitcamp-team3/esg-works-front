import ChartModal from "@/lib/components/modal/chart-modal";
import ReportModal from "@/lib/components/modal/document-modal";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Main Page</h1>
      <p className="text-lg">This is the main content area.</p>
      <ChartModal />
      {/* <ReportModal /> */}
    </div>
  );
};
export default Page;
