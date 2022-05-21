import {Layout} from "antd";
import {FC} from "react";
import {FullPageLoader} from "../components/loaders";
import {useGlobalContext} from "../context/GlobalContext";
import styles from "../styles/layouts/SignInLayout.module.scss";

const {Content} = Layout;

export const Signinlayout: FC = ({children}) => {
  const {showLoader} = useGlobalContext();
  return (
    <Layout>
      {showLoader ? <FullPageLoader /> : null}
      <Content className={styles.mainWrapper}>{children}</Content>
    </Layout>
  );
};
