import { HTTP_STATUS } from "@/constants";
import { IGamesRes } from "@/interfaces/response/rechargeGameCard";
import { requestGetListGames } from "@/services/rechargeGameCard";
import {
  Backdrop,
  Box,
  Button,
  Input,
  InputAdornment,
  Modal,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import Image from "next/image";

interface IProps {
  auto?: boolean;
}

const SelectGame = ({ auto }: IProps) => {
  const [listGames, setListGames] = useState<IGamesRes[]>([]);
  const [gameSelected, setGameSelected] = useState<IGamesRes>();
  const [cardCode, setCardCode] = useState<string>("");
  const [cardValue, setCardValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModalQr, setOpenModalQr] = useState<boolean>(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    renderListGames();
  }, []);

  const renderListGames = async () => {
    try {
      const res = await requestGetListGames();
      if (res?.status === HTTP_STATUS.OK) {
        setListGames(res?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setOpenModalQr(false);
    setOtp("");
  };

  const handleSubmit = () => {
    if (auto) {
      if (cardValue && gameSelected) {
        setOpenModalQr(true);
        setTimeout(() => {
          toast.success("Thanh toán thành công");
        }, 2000);
      }
    } else {
      console.log("getOTP");
    }
  };
  const handleRecharge = () => {
    if (otp) {
      try {
        setLoading(true);
        setLoading(false);
        toast.success("Nạp thẻ thành công");
        handleClose();
        setCardCode("");
      } catch {
        setLoading(false);
        toast.error("Nạp thẻ không thành công");
      }
    }
  };
  return (
    <div className="w-full">
      <p className="w-full bg-gray-200 font-bold py-2 px-4 text-lg my-4">
        Chọn game
      </p>
      <div className="flex flex-wrap gap-3">
        {listGames?.map((g) => (
          <div
            key={g.id}
            onClick={() => setGameSelected(g)}
            className={` min-w-24 w-36 rounded-lg cursor-pointer hover:scale-105  hover:shadow-lg transition-all hover:text-[#f3a44a] ${
              g.id === gameSelected?.id
                ? " border-[#f3a44a] shadow-md border-2"
                : " border-[#00000038] border-2"
            }`}
          >
            <Image
              src={g.image}
              alt="game"
              width={135}
              height={100}
              className="w-full h-[100px] rounded-t-lg"
            />
            <p className="text-center text-sm my-2 hover:text-[#f3a44a]">
              {g.name}
            </p>
          </div>
        ))}
      </div>
      {auto ? (
        <div className="flex mt-8 gap-4 items-center">
          <p className="text-base font-semibold">Nhập mệnh giá: </p>

          <NumericFormat
            value={cardValue}
            customInput={TextField}
            InputProps={{
              endAdornment: <InputAdornment position="start">đ</InputAdornment>,
            }}
            allowNegative={false}
            thousandSeparator
            placeholder="0"
            onValueChange={({ value }) => setCardValue(Number(value))}
          />
        </div>
      ) : (
        <div className=" w-full">
          <div className="flex mt-8 gap-4 items-center">
            <p className="text-base font-semibold min-w-16">IGG ID: </p>
            <Input
              className="border border-gray-300 rounded"
              value={cardCode}
              onChange={(e) => setCardCode(e.target.value)}
            />
          </div>
          <div className="flex mt-8 gap-4 items-center">
            <p className="text-base font-semibold min-w-16">OTP: </p>
            <div className="relative">
              <Input
                className="border border-gray-300 rounded"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />{" "}
              <p className="absolute -bottom-6 left-0 whitespace-nowrap text-xs text-blue-600 mt-3">
                (* OTP will be sent via your ID)
              </p>
            </div>
            <p
              className="text-[#e6a357] cursor-pointer underline"
              onClick={handleSubmit}
            >
              Get code
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col mt-4 items-center">
        <Button
          onClick={auto ? handleSubmit : handleRecharge}
          className={` w-32 bg-[#05296b] text-white min-h-11 mt-4  ${
            ((cardCode && otp) || cardValue) && gameSelected
              ? "cursor-pointer hover:bg-[#30466b]"
              : "cursor-not-allowed opacity-50 hover:bg-[#05296b] hover:text-white"
          }`}
        >
          {auto ? "Thanh toán" : "Nạp"}
        </Button>
      </div>

      {openModalQr && (
        <Modal
          open={openModalQr}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Box sx={style}>
            <div className="w-full flex justify-center">
              <Image src={"/img/qr.jpg"} alt="qr" width={500} height={500} />
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};
export default SelectGame;
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
