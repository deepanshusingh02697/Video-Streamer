import { useQuery } from "@apollo/client/react";
import type { CurrUserQuery } from "../../types/__generated__/graphql";
import { getCurUser_Query } from "../../graphql/Query";

export const useContextCurUser = () => {
  const { data } = useQuery<CurrUserQuery>(getCurUser_Query);
  const authUser = data?.currentUser;
  return { authUser };
};
