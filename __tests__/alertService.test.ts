import {triggerSosAlert} from "../src/services/alert";
import * as db from "../src/services/database";
import * as sms from "../src/services/sms";
import * as geo from "../src/services/geocoding";

jest.mock("../src/services/database");
jest.mock("../src/services/sms");
jest.mock("../src/services/geocoding");

describe("triggerSosAlert", () => {
  const mockLocation = {
    latitude: 1,
    longitude: 2,
    timestamp: Date.now(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("creates an alert and sends SMS to all contacts", async () => {
    (db.getUserContacts as jest.Mock).mockResolvedValue([
      {id: "c1", phone: "+111", name: "Alice"},
      {id: "c2", phone: "+222", name: "Bob"},
    ]);
    (geo.reverseGeocodeLocation as jest.Mock).mockResolvedValue({
      formatted: "Test Address",
    });
    (db.createAlert as jest.Mock).mockResolvedValue("alert123");
    (sms.sendSmsAlert as jest.Mock).mockResolvedValue({});

    const id = await triggerSosAlert({
      userId: "user1",
      location: mockLocation as any,
    });

    expect(db.createAlert).toHaveBeenCalled();
    expect(sms.sendSmsAlert).toHaveBeenCalledTimes(2);
    expect(id).toBe("alert123");
  });
});

