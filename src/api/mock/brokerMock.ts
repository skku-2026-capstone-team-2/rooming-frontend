import type {
  BrokerOfficeData,
  BrokerOfficeListData,
  BrokerOfficeCreateRequest,
  BrokerPropertyData,
  BrokerPropertyCreateRequest,
  BrokerPropertySummaryData,
  BrokerContact,
} from "../../types";
import { mockData } from "./runtime";

const mockOffices: BrokerOfficeData[] = [
  {
    officeId: 1,
    officeName: "성균관 공인중개사",
    officePhone: "02-760-1234",
    officeAddress: "서울 종로구 성균관로 25-2",
  },
  {
    officeId: 2,
    officeName: "혜화역 공인중개사",
    officePhone: "02-741-9012",
    officeAddress: "서울 종로구 창경궁로 254",
  },
];

let _officeIdSeq = mockOffices.length;
let _propertyIdSeq = 200;

const mockBrokerProperties: BrokerPropertyData[] = [];

/** 매물별 담당 중개사 연락처 mock. propertyId 기준으로 순환 배정한다. */
const mockBrokerContacts: BrokerContact[] = [
  {
    brokerId: 1,
    name: "김루밍",
    officeName: "성균관 공인중개사",
    phoneNumber: "02-760-1234",
  },
  {
    brokerId: 2,
    name: "이중개",
    officeName: "명륜 부동산",
    phoneNumber: "02-765-5678",
  },
  {
    brokerId: 3,
    name: "박소장",
    officeName: "혜화역 공인중개사",
    phoneNumber: "02-741-9012",
  },
];

export const brokerMock = {
  getOffices(): Promise<BrokerOfficeListData> {
    return mockData({ offices: [...mockOffices] });
  },

  createOffice(body: BrokerOfficeCreateRequest): Promise<BrokerOfficeData> {
    const office: BrokerOfficeData = {
      officeId: ++_officeIdSeq,
      officeName: body.officeName,
      officePhone: body.officePhone,
      officeAddress: body.officeAddress,
    };
    mockOffices.push(office);
    return mockData({ ...office });
  },

  createProperty(body: BrokerPropertyCreateRequest): Promise<BrokerPropertyData> {
    const property: BrokerPropertyData = {
      propertyId: ++_propertyIdSeq,
      title: body.title,
      propertyType: body.propertyType ?? null,
      roadAddress: body.roadAddress,
      location: body.location,
      tradeType: body.tradeType,
      depositAmount: body.depositAmount,
      monthlyRent: body.monthlyRent ?? null,
      maintenanceFee: body.maintenanceFee ?? null,
      areaM2: body.areaM2,
      floorInfo: body.floorInfo ?? null,
      description: body.description ?? null,
      tags: body.tags ?? null,
      hasProperty3D: false,
    };
    mockBrokerProperties.push(property);
    return mockData({ ...property });
  },

  getMyProperties(): Promise<BrokerPropertySummaryData[]> {
    return mockData(
      mockBrokerProperties.map((p) => ({
        propertyId: p.propertyId,
        title: p.title,
      }))
    );
  },

  getBrokerContact(propertyId: number): Promise<BrokerContact> {
    const index =
      ((propertyId % mockBrokerContacts.length) + mockBrokerContacts.length) %
      mockBrokerContacts.length;
    return mockData({ ...mockBrokerContacts[index] });
  },
};
