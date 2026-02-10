export default function NotificationSuccess() {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">¡Éxito!</strong>
      <span className="block sm:inline"> El producto ha sido creado correctamente.</span>
    </div>
  );
}