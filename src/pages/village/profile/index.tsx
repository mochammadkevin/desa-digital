import {
  Button,
  Flex,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import Container from "Components/container";
import TopBar from "Components/topBar";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import HeaderUpload from "../../../components/form/HeaderUpload";
import LogoUpload from "../../../components/form/LogoUpload";
import { auth, firestore, storage } from "../../../firebase/clientApp";

import {
  getProvinces,
  getRegencies,
  getDistricts,
  getVillages,
} from "../../../services/locationServices";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

interface Location {
  id: string;
  name: string;
}

const AddVillage: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [selectedLogo, setSelectedLogo] = useState<string>("");
  const [selectedHeader, setSelectedHeader] = useState<string>("");
  const selectedLogoRef = useRef<HTMLInputElement>(null);
  const selectedHeaderRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [textInputValue, setTextInputValue] = useState({
    name: "",
    description: "",
    potensi: "",
    geografis: "",
    infrastruktur: "",
    kesiapan: "",
    literasi: "",
    pemantapan: "",
    sosial: "",
    resource: "",
    whatsapp: "",
    instagram: "",
    website: "",
  });
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [regencies, setRegencies] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [villages, setVillages] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedRegency, setSelectedRegency] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedVillage, setSelectedVillage] = useState<string>("");

  const handleFetchProvinces = async () => {
    try {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const handleFetchRegencies = async (provinceId: string) => {
    try {
      const regenciesData = await getRegencies(provinceId);
      setRegencies(regenciesData);
    } catch (error) {
      console.error("Error fetching regencies:", error);
    }
  };

  const handleFetchDistricts = async (regencyId: string) => {
    try {
      const districtsData = await getDistricts(regencyId);
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleFetchVillages = async (districtId: string) => {
    try {
      const villagesData = await getVillages(districtId);
      setVillages(villagesData);
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };

  useEffect(() => {
    handleFetchProvinces();
  }, []);

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const provinceId = event.target.value;
    const provinceName = event.target.options[event.target.selectedIndex].text;
    setSelectedProvince(provinceName);
    handleFetchRegencies(provinceId);
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    setSelectedRegency("");
    setSelectedDistrict("");
    setSelectedVillage("");
  };

  const handleRegencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const regencyId = event.target.value;
    const regencyName = event.target.options[event.target.selectedIndex].text;
    setSelectedRegency(regencyName);
    handleFetchDistricts(regencyId);
    setDistricts([]);
    setVillages([]);
    setSelectedDistrict("");
    setSelectedVillage("");
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const districtId = event.target.value;
    const districtName = event.target.options[event.target.selectedIndex].text;
    setSelectedDistrict(districtName);
    handleFetchVillages(districtId);
    setVillages([]);
    setSelectedVillage("");
  };

  const handleVillageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const villageName = event.target.options[event.target.selectedIndex].text;
    setSelectedVillage(villageName);
  };

  const toast = useToast();

  const onSelectLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedLogo(readerEvent.target?.result as string);
      }
    };
  };

  const onSelectHeader = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedHeader(readerEvent.target?.result as string);
      }
    };
  };

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitForm = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!user?.uid) {
      setError("User ID is not defined. Please make sure you are logged in.");
      setLoading(false);
      return;
    }

    try {
      const {
        name,
        description,
        potensi,
        geografis,
        infrastruktur,
        kesiapan,
        literasi,
        pemantapan,
        sosial,
        resource,
        whatsapp,
        instagram,
        website,
      } = textInputValue;
      if (
        !name ||
        !description ||
        !potensi ||
        !geografis ||
        !infrastruktur ||
        !kesiapan ||
        !literasi ||
        !pemantapan ||
        !sosial ||
        !resource ||
        !whatsapp ||
        !instagram ||
        !website 
        // !selectedProvince ||
        // !selectedDistrict ||
        // !selectedRegency ||
        // !selectedVillage
      ) {
        setError("Semua kolom harus diisi");
        setLoading(false);
        return;
      }
      console.log(textInputValue);
      
      const userId = user.uid;
      const docRef = doc(firestore, "villages", userId);
      await setDoc(docRef, {
        namaDesa: name,
        id: userId,
        deskripsi: description,
        potensiDesa: potensi,
        geografisDesa: geografis,
        infrastrukturDesa: infrastruktur,
        kesiapanDesa: kesiapan,
        literasiDesa: literasi,
        pemantapanDesa: pemantapan,
        sosialBudaya: sosial,
        sumberDaya: resource,
        whatsapp: whatsapp,
        instagram: instagram,
        website: website,
        lokasi: {
          provinsi: selectedProvince,
          kabupatenKota: selectedRegency,
          kecamatan: selectedDistrict,
          desaKelurahan: selectedVillage,
        },
      });
      console.log("Document writen with ID: ", userId);
      // Upload logo
      if (selectedLogo) {
        const logoRef = ref(storage, `villages/${userId}/logo`);
        await uploadString(logoRef, selectedLogo, "data_url").then(async () => {
          const downloadURL = await getDownloadURL(logoRef);
          await updateDoc(doc(firestore, "villages", userId), {
            logo: downloadURL,
          });
          console.log("File available at", downloadURL);
        });
      } else {
        setError("Logo harus diisi");
        setLoading(false);
        return;
      }

      // Upload header if provided
      if (selectedHeader) {
        const headerRef = ref(storage, `villages/${userId}/header`);
        await uploadString(headerRef, selectedHeader, "data_url").then(
          async () => {
            const downloadURL = await getDownloadURL(headerRef);
            await updateDoc(doc(firestore, "villages", userId), {
              header: downloadURL,
            });
            console.log("File available at", downloadURL);
          }
        );
      }

      setLoading(false);

      toast({
        title: "Profile berhasil dibuat",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      setLoading(false);
      setError("Error adding document");
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menambahkan dokumen.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container page px={16}>
      <TopBar title="Registrasi Desa" onBack={() => navigate(-1)} />
      <form onSubmit={onSubmitForm}>
        <Flex direction="column" marginTop="24px">
          <Stack spacing={3} width="100%">
            <Text fontWeight="400" fontSize="14px">
              Nama Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="name"
              fontSize="10pt"
              placeholder="Nama Desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.name}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Provinsi <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Provinsi"
              fontSize="10pt"
              variant="outline"
              cursor="pointer"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              onChange={handleProvinceChange}
            >
              {provinces.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </Select>

            <Text fontWeight="400" fontSize="14px">
              Kabupaten/Kota <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Kabupaten/Kota"
              fontSize="10pt"
              variant="outline"
              cursor="pointer"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              onChange={handleRegencyChange}
              disabled={regencies.length === 0}
            >
              {regencies.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>

            <Text fontWeight="400" fontSize="14px">
              Kecamatan <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Kecamatan"
              fontSize="10pt"
              variant="outline"
              cursor="pointer"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              onChange={handleDistrictChange}
              disabled={districts.length === 0}
            >
              {districts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>

            <Text fontWeight="400" fontSize="14px">
              Desa/Kelurahan <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Kelurahan"
              fontSize="10pt"
              variant="outline"
              cursor="pointer"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              disabled={villages.length === 0}
              onChange={handleVillageChange}
            >
              {villages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>

            <Text fontWeight="400" fontSize="14px">
              Logo Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <LogoUpload
              selectedLogo={selectedLogo}
              setSelectedLogo={setSelectedLogo}
              selectFileRef={selectedLogoRef}
              onSelectLogo={onSelectLogo}
            />

            <Text fontWeight="400" fontSize="14px">
              Header Desa
            </Text>
            <HeaderUpload
              selectedHeader={selectedHeader}
              setSelectedHeader={setSelectedHeader}
              selectFileRef={selectedHeaderRef}
              onSelectHeader={onSelectHeader}
            />

            <Text fontWeight="400" fontSize="16px">
              Tentang Inovasi di Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <Textarea
              name="description"
              fontSize="10pt"
              placeholder="Masukkan deskripsi desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              height="100px"
              value={textInputValue.description}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Potensi Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="potensi"
              fontSize="10pt"
              placeholder="Masukkan potensi desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.potensi}
              onChange={onTextChange}
            />

            <Text fontWeight="700" fontSize="16px">
              Karakteristik Desa
            </Text>
            <Text fontWeight="400" fontSize="14px">
              Geografis <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="geografis"
              fontSize="10pt"
              placeholder="Deskripsi geografis desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.geografis}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Infrastruktur <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="infrastruktur"
              fontSize="10pt"
              placeholder="Deskripsi infrastruktur desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.infrastruktur}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Kesiapan Digital <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="kesiapan"
              fontSize="10pt"
              placeholder="Deskripsi kesiapan digital desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.kesiapan}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Literasi Digital <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="literasi"
              fontSize="10pt"
              placeholder="Deskripsi literasi digital desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.literasi}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Pemantapan Pelayanan <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="pemantapan"
              fontSize="10pt"
              placeholder="Deskripsi pemantapan pelayanan desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.pemantapan}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Sosial dan Budaya <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="sosial"
              fontSize="10pt"
              placeholder="Deskripsi sosial dan budaya desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.sosial}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Sumber Daya Alam <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="resource"
              fontSize="10pt"
              placeholder="Deskripsi sumber daya alam desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.resource}
              onChange={onTextChange}
            />

            <Text fontWeight="700" fontSize="16px">
              Kontak Desa
            </Text>
            <Text fontWeight="400" fontSize="14px">
              Nomor WhatsApp <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="whatsapp"
              fontSize="10pt"
              placeholder="62812345678"
              type="number"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.whatsapp}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Link Instagram <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="instagram"
              type="url"
              fontSize="10pt"
              placeholder="Link Instagram desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.instagram}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Link Website <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="website"
              type="url"
              fontSize="10pt"
              placeholder="Link Website desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.website}
              onChange={onTextChange}
            />
          </Stack>
        </Flex>
        {error && (
          <Text color="red" fontSize="10pt" textAlign="center" mt={2}>
            {error}
          </Text>
        )}
        <Button type="submit" mt="20px" width="100%" isLoading={loading}>
          Simpan
        </Button>
      </form>
    </Container>
  );
};

export default AddVillage;
