import AddEntity from "../components/AddEntity.js";
import api from "../axiosSetup.js";

const AddPublisher = () => {
  const fields = [
    { name: "legalname", label: "Юридическое название", type: "text", required: true },
    { name: "contactnum", label: "Контактный номер", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "country", label: "Страна", type: "text", required: true },
    { name: "city", label: "Город", type: "text", required: true },
    { name: "street", label: "Улица", type: "text", required: true },
    { name: "house", label: "Дом", type: "text", required: false },
    { name: "apartment", label: "Квартира", type: "text", required: false },
    { name: "indexmail", label: "Почтовый индекс", type: "text", required: false },
  ];

  const handleSubmit = async (form, navigate, setError, setLoading) => {
    try {
      setLoading(true);
      const addressRes = await api.post("/addresses", {
        country: form.country,
        city: form.city,
        street: form.street,
        house: form.house,
        apartment: form.apartment,
        indexmail: form.indexmail,
      });

      const address_id = addressRes.data.id_address;

      await api.post("/publishers", {
        legalname: form.legalname,
        contactnum: form.contactnum,
        email: form.email,
        address_id,
      });

      navigate(-1);
    } catch (err) {
      console.error("Ошибка при добавлении издателя:", err);
      setError("Не удалось добавить издателя");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddEntity
      title="Добавить издателя"
      description="Введите данные нового издателя и его адрес"
      fields={fields}
      customSubmit={handleSubmit} 
    />
  );
};

export default AddPublisher;
