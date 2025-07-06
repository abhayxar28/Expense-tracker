import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import EmojiPicker from "emoji-picker-react"
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL 

export function AddIncomeModal({ onIncomeAdded }: { onIncomeAdded: () => void }) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState("")
  const [icon, setIcon] = useState("💰")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [open, setOpen] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formattedDate = new Date(date).toISOString();
      const response = await axios.post(
        `${DATABASE_URL}/transactions`,
        {
          title,
          amount,
           date: formattedDate,
          icon,
          category: "income",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      if (response.data) {
        toast.success("Income added successfully")
        onIncomeAdded();
        setOpen(false);
      } else {
        toast.error("Income not added")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#f8f2ff] text-[#8c4ecf] hover:bg-[#caa6f3] hover:text-[#8c4ecf] cursor-pointer"
        >
          <Plus />
          Add Income
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Pick Icon</Label>
              <div className="flex items-center gap-3">
                <span
                  className="text-2xl cursor-pointer"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  {icon}
                </span>
                {showEmojiPicker && (
                  <div className="z-50 absolute mt-2">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setIcon(emojiData.emoji)
                        setShowEmojiPicker(false)
                      }}
                      height={350}
                      width={300}
                      lazyLoadEmojis
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Income Source</Label>
              <Input
                id="title"
                name="title"
                placeholder="Freelance, Salary, etc."
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                onChange={(e) => setAmount(parseInt(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">Add Income</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
