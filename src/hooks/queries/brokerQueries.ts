/**
 * 중개사(broker) 도메인 React Query 훅.
 *
 * - queryFn은 도메인 API(`brokerApi`/`authApi`)를 그대로 호출하므로 mock ↔ real
 *   전환(`USE_MOCK`)에 화면 코드가 영향받지 않는다.
 * - 모든 mutation은 관련 쿼리를 invalidate 하여 화면이 최신 상태를 반영하도록 한다.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, brokerApi } from "../../api";
import type {
  BrokerAdditionalInfoRequest,
  BrokerOfficeCreateRequest,
  BrokerPropertyCreateRequest,
} from "../../types";

/** 중개사 queryKey 컨벤션. */
export const brokerKeys = {
  /** 매물 담당 중개사 연락처 */
  contact: (propertyId: number) => ["broker", "contact", propertyId] as const,
  /** 현재 로그인한 중개사 프로필 */
  profile: ["broker", "profile"] as const,
  /** 선택 가능한 중개사무소 목록 */
  offices: ["broker", "offices"] as const,
  /** 현재 중개사가 등록한 매물 목록 */
  myProperties: ["broker", "my-properties"] as const,
};

/**
 * 매물 담당 중개사 연락처. `propertyId`가 유효하고 `enabled`일 때만 실행한다.
 * (모달을 열 때 lazy 하게 조회하기 위해 `enabled`로 제어)
 */
export function useBrokerContact(propertyId: number, enabled = true) {
  return useQuery({
    queryKey: brokerKeys.contact(propertyId),
    queryFn: () => brokerApi.getBrokerContact(propertyId),
    enabled,
  });
}

/** 현재 로그인한 중개사 프로필(인증 상태 포함). */
export function useBrokerProfile(enabled = true) {
  return useQuery({
    queryKey: brokerKeys.profile,
    queryFn: () => authApi.getBrokerProfile(),
    enabled,
  });
}

/** 추가 정보 입력 시 선택할 수 있는 중개사무소 목록. */
export function useBrokerOffices(enabled = true) {
  return useQuery({
    queryKey: brokerKeys.offices,
    queryFn: () => brokerApi.getOffices(),
    select: (data) => data.offices,
    enabled,
  });
}

/** 현재 중개사가 등록한 매물 목록(요약). */
export function useMyBrokerProperties(enabled = true) {
  return useQuery({
    queryKey: brokerKeys.myProperties,
    queryFn: () => brokerApi.getMyProperties(),
    enabled,
  });
}

/** 수동 인증용 추가 정보(사업자번호/연락처/사무소) 저장. */
export function useUpdateBrokerAdditionalInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: BrokerAdditionalInfoRequest) =>
      authApi.updateBrokerAdditionalInfo(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerKeys.profile });
    },
  });
}

/** 중개사 자격 증빙 서류 업로드. */
export function useUploadBrokerVerificationDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => authApi.uploadBrokerVerificationDocument(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerKeys.profile });
    },
  });
}

/** 새 중개사무소 등록. */
export function useCreateBrokerOffice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: BrokerOfficeCreateRequest) => brokerApi.createOffice(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerKeys.offices });
    },
  });
}

/** 새 매물 등록. */
export function useCreateBrokerProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: BrokerPropertyCreateRequest) =>
      brokerApi.createProperty(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerKeys.myProperties });
    },
  });
}
