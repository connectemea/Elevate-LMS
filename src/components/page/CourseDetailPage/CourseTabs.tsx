"use client";

import { Tabs } from "antd";

type Props = {
  activeKey: string;
  onChange: (key: string) => void;
  detailsTab: React.ReactNode;
  enrollmentsTab: React.ReactNode;
  enrollmentCount: number;
};

export default function CourseTabs({
  activeKey,
  onChange,
  detailsTab,
  enrollmentsTab,
  enrollmentCount,
}: Props) {
  return (
    <Tabs activeKey={activeKey} onChange={onChange}>
      <Tabs.TabPane tab="Course Details" key="details">
        {detailsTab}
      </Tabs.TabPane>

      <Tabs.TabPane tab={`Enrollments (${enrollmentCount})`} key="enrollments">
        {enrollmentsTab}
      </Tabs.TabPane>
    </Tabs>
  );
}
