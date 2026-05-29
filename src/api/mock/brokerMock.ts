import type {
  BrokerOfficeData,
  BrokerOfficeListData,
  BrokerOfficeCreateRequest,
  BrokerPropertyData,
  BrokerPropertyCreateRequest,
} from "../../types";
import { mockData } from "./runtime";

let _officeIdSeq = 1;
let _propertyIdSeq = 200;

const mockOffices: BrokerOfficeData[] = [];
const mockBrokerProperties: BrokerPropertyData[] = [];

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
};
