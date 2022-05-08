import { Button } from "antd"
import { useRouter } from "next/router"
import { FC } from "react"
import { RollbackOutlined } from "@ant-design/icons"

export const Backbutton: FC<{ backgroundColor?: string }> = ({ backgroundColor = "#1890ff" }) => {
    const router = useRouter()
    return (
        <Button style={{ background: backgroundColor, borderColor: backgroundColor, borderRadius: "6px" }} type='primary' size="large" icon={<RollbackOutlined />} onClick={() => router.back()}>Back</Button>
    )
} 