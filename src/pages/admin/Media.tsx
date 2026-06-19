export default function AdminMedia() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Media Management</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Media Files</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Upload Media</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-2">
            <img src="https://via.placeholder.com/150" alt="Media" className="w-full h-24 object-cover rounded" />
            <p className="text-sm mt-1">campaign-banner.jpg</p>
          </div>
        </div>
      </div>
    </div>
  );
}