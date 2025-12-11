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
  const items = [
    {
      key: "details",
      label: "Course Details",
      children: detailsTab,
    },
    {
      key: "enrollments",
      label: `Enrollments (${enrollmentCount})`,
      children: enrollmentsTab,
    },
  ];

  return <Tabs activeKey={activeKey} onChange={onChange} items={items} />;
}
