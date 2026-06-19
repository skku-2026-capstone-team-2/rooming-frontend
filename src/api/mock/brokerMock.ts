import type {
  BrokerOfficeData,
  BrokerOfficeListData,
  BrokerOfficeCreateRequest,
  BrokerPropertyData,
  BrokerPropertyCreateRequest,
  BrokerPropertySummaryData,
} from "../../types";
import { mockData } from "./runtime";

const mockOffices: BrokerOfficeData[] = [
  {
    officeId: 1,
    officeName: "Campus Realty",
    officePhone: "02-760-1234",
    officeAddress: "25-2 Sungkyunkwan-ro, Jongno-gu, Seoul",
  },
  {
    officeId: 2,
    officeName: "Hyehwa Realty",
    officePhone: "02-741-9012",
    officeAddress: "254 Changgyeonggung-ro, Jongno-gu, Seoul",
  },
];

let officeIdSeq = mockOffices.length;
let propertyIdSeq = 200;

const mockBrokerProperties: BrokerPropertyData[] = [];

export const brokerMock = {
  getOffices(): Promise<BrokerOfficeListData> {
    return mockData({ offices: [...mockOffices] });
  },

  createOffice(body: BrokerOfficeCreateRequest): Promise<BrokerOfficeData> {
    const office: BrokerOfficeData = {
      officeId: ++officeIdSeq,
      officeName: body.officeName,
      officePhone: body.officePhone,
      officeAddress: body.officeAddress,
    };
    mockOffices.push(office);
    return mockData({ ...office });
  },

  createProperty(body: BrokerPropertyCreateRequest): Promise<BrokerPropertyData> {
    const property: BrokerPropertyData = {
      propertyId: ++propertyIdSeq,
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
      mockBrokerProperties.map((property) => ({
        propertyId: property.propertyId,
        title: property.title,
      }))
    );
  },
};
