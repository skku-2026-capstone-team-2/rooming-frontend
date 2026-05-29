import type {
  SeekerProfileData,
  BrokerProfileData,
  BrokerAdditionalInfoRequest,
} from "../../types";
import { mockData } from "./runtime";

const mockSeeker: SeekerProfileData = {
  userId: 1,
  email: "seeker@example.com",
  name: "홍길동",
  accountType: "SEEKER",
};

const mockBroker: BrokerProfileData = {
  brokerId: 1,
  email: "broker@example.com",
  name: "김중개",
  accountType: "BROKER",
  officeId: null,
  officeName: null,
  registrationNo: null,
  officePhone: null,
  officeAddress: null,
  phoneNumber: null,
  hasVerificationDocument: false,
  verificationDocumentFileName: null,
  isVerified: false,
  profileComplete: false,
};

export const profileMock = {
  getSeekerProfile(): Promise<SeekerProfileData> {
    return mockData({ ...mockSeeker });
  },

  getBrokerProfile(): Promise<BrokerProfileData> {
    return mockData({ ...mockBroker });
  },

  updateBrokerAdditionalInfo(body: BrokerAdditionalInfoRequest): Promise<BrokerProfileData> {
    Object.assign(mockBroker, {
      officeId: body.officeId ?? null,
      registrationNo: body.registrationNo,
      phoneNumber: body.phoneNumber,
      profileComplete: !!(body.registrationNo && body.phoneNumber),
    });
    return mockData({ ...mockBroker });
  },
};
