import svgPaths from "./svg-j1qskfjkvm";
import imgImage4 from "figma:asset/37f0ad5e38d3b77226cf7d7ce6257c80ad142d70.png";
import imgImage6 from "figma:asset/0e08f3e033ea395c8b9d6c3021e9cd3a44482ac0.png";
import imgBloomGrow21 from "figma:asset/6bd3fd280147ace4fce2e0f0ba5576a5659a8003.png";

function StateLayer1() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
      <div className="relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
            <path d={svgPaths.p2304a600} fill="var(--fill-0, #49454F)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="cursor-pointer flex-[1_0_0] h-full min-h-px min-w-px mr-[-16px] relative" data-name="Content">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] relative size-full">
          <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#49454f] text-[16px] tracking-[0.5px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[24px]">search text</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StateLayer2() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
      <div className="relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute inset-[12.5%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path d={svgPaths.p16b4a380} fill="var(--fill-0, #49454F)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TrailingElements() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-end right-[4px] top-1/2" data-name="Trailing-Elements">
      <div className="content-stretch flex items-center justify-center relative shrink-0 size-[48px]" data-name="1st trailing-icon">
        <div className="content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
          <StateLayer2 />
        </div>
      </div>
    </div>
  );
}

function StateLayer() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="state-layer">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[4px] pr-[20px] py-[4px] relative size-full">
          <div className="content-stretch flex items-center justify-center mr-[-16px] relative shrink-0 size-[48px]" data-name="Leading-icon">
            <div className="content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
              <StateLayer1 />
            </div>
          </div>
          <Content />
          <TrailingElements />
        </div>
      </div>
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="bg-white relative shadow-[0px_4px_4px_0px_black] size-full" data-name="Desktop - 1">
      <div className="absolute h-[36px] left-[488px] rounded-[5px] top-[297px] w-[149px]" data-name="Email">
        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.5)] border-solid inset-[-1px] pointer-events-none rounded-[6px]" />
        <div className="absolute bg-[#fffbfb] inset-0 rounded-[20px]" />
        <p className="absolute font-['Quicksand:Medium',sans-serif] font-medium inset-[13.89%_31.21%_13.89%_5.2%] leading-[normal] text-[18px] text-[rgba(0,0,0,0.33)] whitespace-pre-wrap">ex. Cruz</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[377px] text-[20px] text-black top-[313.5px] tracking-[-0.4px] w-[312px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Last Name</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[896.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Purok 1</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[937.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Purok 2</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[977.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Purok 3</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1021.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Purok 4</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1058.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Purok 5</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1156.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Program 1</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1197.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Program 2</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1237.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Program 3</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1281.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Program 4</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1318.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">Program 5</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1419.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">2026</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1460.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">2025</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1500.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">2024</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1544.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">2023</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[106px] text-[20px] text-black top-[1583.5px] tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.2] whitespace-pre-wrap">2022</p>
      </div>
      <div className="absolute h-[36px] left-[787px] rounded-[5px] top-[297px] w-[194px]" data-name="Email">
        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.5)] border-solid inset-[-1px] pointer-events-none rounded-[6px]" />
        <div className="absolute bg-[#fffbfb] inset-0 rounded-[20px]" />
        <p className="absolute font-['Quicksand:Medium',sans-serif] font-medium inset-[13.89%_31.21%_13.89%_5.2%] leading-[normal] text-[18px] text-[rgba(0,0,0,0.33)] whitespace-pre-wrap">ex. John</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Quicksand:Bold',sans-serif] font-bold h-[43px] justify-center leading-[0] left-[667px] text-[20px] text-black top-[313.5px] tracking-[-0.4px] w-[144px]">
        <p className="leading-[1.2] whitespace-pre-wrap">First Name</p>
      </div>
      <div className="absolute flex h-[1852.663px] items-center justify-center left-[-711px] top-[-10px] w-[2755.092px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-[-90.6deg]">
          <div className="h-[2736.119px] relative w-[1824.079px]" data-name="image 4">
            <img alt="" className="absolute inset-0 max-w-none object-cover opacity-80 pointer-events-none size-full" src={imgImage4} />
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Light',sans-serif] font-light h-[49px] justify-center leading-[0] left-[1898px] text-[#110c0c] text-[11px] top-[64.5px] tracking-[-0.22px] w-[146px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[1.2] whitespace-pre-wrap">Staff Name</p>
      </div>
      <div className="absolute left-[1874px] size-[24px] top-[53px]" data-name="arrow_drop_down">
        <div className="absolute inset-[41.67%_29.17%_37.5%_29.17%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 5">
            <path d="M5 5L0 0H10L5 5Z" fill="var(--fill-0, black)" id="icon" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[1779px] overflow-clip size-[24px] top-[53px]" data-name="Bell">
        <div className="absolute inset-[8.33%_12.5%_8.35%_12.5%]" data-name="Icon">
          <div className="absolute inset-[-6.25%_-6.94%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.5002 22.4965">
              <path d={svgPaths.p31dc4b00} id="Icon" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute h-[38px] left-[1830px] overflow-clip top-[46px] w-[39px]" data-name="account_circle">
        <div className="absolute inset-[8.33%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.5 31.6667">
            <path d={svgPaths.p2e920300} fill="var(--fill-0, #1D1B20)" id="icon" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[25px] left-[1737px] overflow-clip top-[53px] w-[24px]" data-name="Clock">
        <div className="absolute inset-[8.33%]" data-name="Icon">
          <div className="absolute inset-[-4.8%_-5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22.8333">
              <path d={svgPaths.p1739ee00} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute h-[769px] left-[325px] top-[175px] w-[1287px]" data-name="Subtract">
        <div className="absolute inset-[0_-0.31%_-1.04%_-0.31%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1295 777">
            <g filter="url(#filter0_d_1_1180)" id="Subtract">
              <path d={svgPaths.p26c4f700} fill="var(--fill-0, white)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="777" id="filter0_d_1_1180" width="1295" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1180" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1180" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[normal] left-[343px] not-italic text-[#004b96] text-[36px] top-[105px] w-[838px] whitespace-pre-wrap">{` HEALTH CENTER MANAGEMENT SYSTEM`}</p>
      <div className="absolute bg-[#004b96] h-[130px] left-[1220px] rounded-[50px] top-[134px] w-[321px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[40px] leading-[normal] left-[1256px] not-italic text-[36px] text-white top-[159px] w-[294px] whitespace-pre-wrap">2025 - 2026</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[40px] leading-[normal] left-[1256px] not-italic text-[24px] text-white top-[204px] w-[219px] whitespace-pre-wrap">FEBRUARY 2026</p>
      <div className="absolute bg-[#004b96] h-[769px] left-[1630px] rounded-[50px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[175px] w-[369px]" />
      <div className="absolute bg-white blur-[2px] h-[115px] left-[1661px] rounded-[20px] top-[280px] w-[307px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Poppins:ExtraBold',sans-serif] h-[69px] justify-center leading-[0] left-[1659px] not-italic text-[30px] text-white top-[245.5px] w-[312px]">
        <p className="leading-[normal] whitespace-pre-wrap">Weekly Program:</p>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[32px] leading-[normal] left-[1691px] not-italic text-[#191010] text-[36px] top-[298px] w-[289px] whitespace-pre-wrap">MONDAY:</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1691px] not-italic text-[#191010] text-[24px] top-[341px] w-[216px] whitespace-pre-wrap">PRENATAL CARE</p>
      <div className="absolute bg-white blur-[2px] h-[116px] left-[1661px] rounded-[20px] top-[406px] w-[307px]" />
      <div className="absolute bg-white blur-[2px] h-[116px] left-[1661px] rounded-[20px] top-[532px] w-[307px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1691px] not-italic text-[#191010] text-[36px] top-[544px] w-[289px] whitespace-pre-wrap">WEDNESDAY:</p>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Poppins:Regular',sans-serif] h-[31px] justify-center leading-[0] left-[1691px] not-italic text-[#191010] text-[16px] top-[612.5px] w-[216px]">
        <p className="leading-[normal] whitespace-pre-wrap">NATIONAL IMMUNIZATION PROGRAM</p>
      </div>
      <div className="absolute bg-white blur-[2px] h-[115px] left-[1661px] rounded-[20px] top-[659px] w-[306px]" />
      <div className="absolute bg-white blur-[2px] h-[115px] left-[1661px] rounded-[20px] top-[785px] w-[306px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[32px] leading-[normal] left-[1691px] not-italic text-[#191010] text-[36px] top-[428px] w-[289px] whitespace-pre-wrap">TUESDAY:</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1691px] not-italic text-[#191010] text-[16px] top-[477px] w-[308px] whitespace-pre-wrap">FAMILY PLANNING/POSTPARTUM</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1691px] not-italic text-[#191010] text-[36px] top-[672px] w-[289px] whitespace-pre-wrap">THURSDAY:</p>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Poppins:Regular',sans-serif] h-[31px] justify-center leading-[0] left-[1691px] not-italic text-[#191010] text-[16px] top-[740.5px] w-[216px]">
        <p className="leading-[normal] whitespace-pre-wrap">NATIONAL TUBERCULOSIS PROGRAM</p>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1691px] not-italic text-[#191010] text-[36px] top-[796px] w-[289px] whitespace-pre-wrap">FRIDAY:</p>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Poppins:Regular',sans-serif] h-[31px] justify-center leading-[0] left-[1691px] not-italic text-[#191010] text-[16px] top-[864.5px] w-[216px]">
        <p className="leading-[normal] whitespace-pre-wrap">CARDIOVASCULAR DISEASE PROGRAM</p>
      </div>
      <div className="absolute bg-white h-[769px] left-[1256px] rounded-[50px] shadow-[0px_4px_4px_0px_black] top-[978px] w-[743px]" />
      <div className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] h-[106px] leading-[normal] left-[1639.5px] not-italic text-[#013155] text-[0px] text-center top-[1095px] w-[609px] whitespace-pre-wrap">
        <p className="mb-0 text-[36px]">PATIENT REGISTRATION</p>
        <p className="font-['Poppins:Regular',sans-serif] text-[20px]">INDIVIDUAL TREATMENT RECORD FOR 6 - YEAR OLD AND OVER</p>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1304px] not-italic text-[#013155] text-[16px] top-[1024px] w-[168px] whitespace-pre-wrap">ITR FOR 6 YEARS OLD</p>
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1625px] not-italic text-[#013155] text-[16px] text-center top-[1024px] w-[168px] whitespace-pre-wrap">ITR FOR 5 YEARS OLD</p>
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1814px] not-italic text-[#013155] text-[16px] text-center top-[1024px] w-[72px] whitespace-pre-wrap">ITMR</p>
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1931px] not-italic text-[#013155] text-[16px] text-center top-[1024px] w-[76px] whitespace-pre-wrap">PCV</p>
      <div className="absolute bg-white border border-[rgba(0,0,0,0.5)] border-solid h-[244px] left-[1298px] top-[1190px] w-[663px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[16px] top-[1210px] w-[168px] whitespace-pre-wrap">IDENTIFYING DATA:</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[13px] top-[1372px] w-[342px] whitespace-pre-wrap">IF MARRIED, SPOUSE’S MAIDEN NAME:</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[14px] top-[1241px] w-[628px] whitespace-pre-wrap">{`LAST NAME:                                                       FIRST NAME:                                         MI:`}</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[0] left-[1316px] not-italic text-[#111112] text-[0px] top-[1263px] w-[628px] whitespace-pre-wrap">
        <span className="leading-[normal] text-[14px]">{`AGE:                     SEX:       `}</span>
        <span className="font-['Poppins:Light',sans-serif] leading-[normal] text-[12px]">{`MALE/ FEMALE `}</span>
        <span className="leading-[normal] text-[14px]">{`                BIRTHDAY:                               RELIGION:                             `}</span>
      </p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[14px] top-[1282px] w-[628px] whitespace-pre-wrap">{`ADDRESS:                                                        BARANGAY:                                        CITY:`}</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[14px] top-[1302px] w-[628px] whitespace-pre-wrap">{`CIVIL STATUS:                                                                              CONTACT NUMBER:`}</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[14px] top-[1320px] w-[628px] whitespace-pre-wrap">{`EDUCATIONAL ATTAINMENT:                                              OCCUPATION:`}</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[14px] top-[1389px] w-[628px] whitespace-pre-wrap">{`OCCUPATION:                                                                         CONTACT NUMBER:`}</p>
      <div className="absolute bg-white border border-[rgba(0,0,0,0.5)] border-solid h-[225px] left-[1298px] top-[1443px] w-[663px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[16px] top-[1463px] w-[225px] whitespace-pre-wrap">PAST MEDICAL HISTORY:</p>
      <div className="absolute flex h-[521px] items-center justify-center left-[1977px] top-[1190px] w-px" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-[90.11deg]">
          <div className="h-0 relative w-[521.001px]">
            <div className="absolute inset-[-5px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 521.001 5">
                <line id="Line 1" stroke="var(--stroke-0, #848181)" strokeLinecap="round" strokeWidth="5" x1="2.5" x2="518.501" y1="2.5" y2="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[0px] top-[1494px] w-[628px] whitespace-pre-wrap">
        <p className="mb-0 text-[14px]">CO -MORBIDITIES:</p>
        <p className="mb-0 text-[12px]">{`                        ALLERGIES, SPECIFY       `}</p>
        <p className="text-[14px]">&nbsp;</p>
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[14px] top-[1565px] w-[628px] whitespace-pre-wrap">{`MAINTENANCE MEDICATION, DOSE & FREQUENCY:`}</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[31px] leading-[normal] left-[1316px] not-italic text-[#111112] text-[14px] top-[1622px] w-[628px] whitespace-pre-wrap">PREVIOUS ILLNESSES/ SURGERIES:</p>
      <div className="absolute bg-[#004b96] h-[29px] left-[1563px] rounded-[50px] top-[1708px] w-[134px]" />
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[31px] leading-[normal] left-[1613px] not-italic text-[14px] text-white top-[1712px] w-[59px] whitespace-pre-wrap">SAVE</p>
      <div className="absolute bg-[#004b96] h-[692px] left-[325px] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[1055px] w-[895px]" />
      <div className="absolute h-[197px] left-[345px] top-[1214px] w-[856px]" data-name="image 6">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#004b96] h-[131px] left-[349px] rounded-[20px] top-[989px] w-[288px]" />
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[382px] not-italic text-[24px] text-white top-[1005px] w-[313px] whitespace-pre-wrap">LOGBOOK ACTIVITY</p>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[377px] not-italic text-[#004b96] text-[24px] top-[244px] w-[313px] whitespace-pre-wrap">PATIENT INFORMATION:</p>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[377px] not-italic text-[#004b96] text-[24px] top-[244px] w-[313px] whitespace-pre-wrap">PATIENT INFORMATION:</p>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[377px] not-italic text-[#004b96] text-[48px] top-[188px] w-[313px] whitespace-pre-wrap">DASHBOARD</p>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[377px] not-italic text-[#004b96] text-[48px] top-[188px] w-[313px] whitespace-pre-wrap">DASHBOARD</p>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[902px] not-italic text-[#004b96] text-[24px] top-[1005px] w-[313px] whitespace-pre-wrap">REPORTS</p>
      <div className="absolute bg-[rgba(0,122,255,0.5)] content-stretch flex h-[39px] items-center justify-center left-[1090px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[1673px] w-[112px]" data-name="next page">
        <div className="flex flex-[1_0_0] h-[16.408px] items-center justify-center min-h-px min-w-px relative" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg] w-full">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] w-full">
              <p className="leading-none whitespace-pre-wrap">{`    Next   » `}</p>
            </div>
          </div>
        </div>
      </div>
      <button className="absolute bg-[rgba(0,122,255,0.5)] content-stretch cursor-pointer flex h-[39px] items-center justify-center left-[867px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[1673px] w-[112px]" data-name="previous page">
        <div className="flex flex-[1_0_0] h-[16.408px] items-center justify-center min-h-px min-w-px relative" style={{ "--transform-inner-width": "63", "--transform-inner-height": "15" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg] w-full">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] text-left w-full">
              <p className="leading-none whitespace-pre-wrap">{`«  Previous`}</p>
            </div>
          </div>
        </div>
      </button>
      <button className="absolute bg-[rgba(0,122,255,0.5)] content-stretch cursor-pointer flex h-[39px] items-center justify-center left-[983px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[1673px] w-[30px]" data-name="numbers">
        <div className="flex h-[16.262px] items-center justify-center relative shrink-0 w-[27.963px]" style={{ "--transform-inner-width": "7", "--transform-inner-height": "15" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg]">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16.149px] justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] text-left w-[27.898px]">
              <p className="leading-none whitespace-pre-wrap">1</p>
            </div>
          </div>
        </div>
      </button>
      <button className="absolute bg-[rgba(0,122,255,0.5)] content-stretch cursor-pointer flex h-[39px] items-center justify-center left-[1019px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[1673px] w-[31px]" data-name="numbers">
        <div className="flex h-[16.262px] items-center justify-center relative shrink-0 w-[27.963px]" style={{ "--transform-inner-width": "7", "--transform-inner-height": "15" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg]">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16.149px] justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] text-left w-[27.898px]">
              <p className="leading-none whitespace-pre-wrap">2</p>
            </div>
          </div>
        </div>
      </button>
      <button className="absolute bg-[rgba(0,122,255,0.5)] content-stretch cursor-pointer flex h-[39px] items-center justify-center left-[1055px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[1673px] w-[30px]" data-name="numbers">
        <div className="flex h-[16.262px] items-center justify-center relative shrink-0 w-[27.963px]" style={{ "--transform-inner-width": "7", "--transform-inner-height": "15" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg]">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16.149px] justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] text-left w-[27.898px]">
              <p className="leading-none whitespace-pre-wrap">3</p>
            </div>
          </div>
        </div>
      </button>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[1066px] not-italic text-[#004b96] text-[24px] top-[1005px] w-[313px] whitespace-pre-wrap">SETTINGS</p>
      <div className="absolute bg-white h-[39px] left-[828px] top-[1098px] w-[172px]" data-name="okey">
        <div className="absolute bg-[rgba(248,253,254,0)] inset-0 rounded-[5px]">
          <div aria-hidden="true" className="absolute border border-[#f8fdfe] border-solid inset-[-1px] pointer-events-none rounded-[6px]" />
        </div>
        <p className="absolute font-['Quicksand:Bold',sans-serif] font-bold inset-[30.43%_7.11%_30.43%_22.67%] leading-[normal] text-[13px] text-black text-center whitespace-pre-wrap">Export PDF Report</p>
      </div>
      <div className="absolute bg-white border border-black border-solid h-[39px] left-[1035px] rounded-[10px] top-[297px] w-[172px]" data-name="okey">
        <div className="absolute bg-[rgba(248,253,254,0)] inset-[-1px] rounded-[5px]">
          <div aria-hidden="true" className="absolute border border-[#f8fdfe] border-solid inset-[-1px] pointer-events-none rounded-[6px]" />
        </div>
        <p className="absolute font-['Quicksand:Bold',sans-serif] font-bold inset-[calc(30.43%-0.39px)_calc(7.11%-0.86px)_calc(30.43%-0.39px)_calc(22.67%-0.55px)] leading-[normal] text-[#110c0c] text-[13px] whitespace-pre-wrap">All Program:</p>
      </div>
      <div className="absolute bg-white border border-black border-solid h-[39px] left-[1215px] rounded-[10px] top-[297px] w-[172px]" data-name="okey">
        <div className="absolute bg-[rgba(248,253,254,0)] inset-[-1px] rounded-[5px]">
          <div aria-hidden="true" className="absolute border border-[#f8fdfe] border-solid inset-[-1px] pointer-events-none rounded-[6px]" />
        </div>
        <p className="absolute font-['Quicksand:Bold',sans-serif] font-bold inset-[calc(30.43%-0.39px)_calc(7.11%-0.86px)_calc(30.43%-0.39px)_calc(22.67%-0.55px)] leading-[normal] text-[#110c0c] text-[13px] whitespace-pre-wrap">All Purok:</p>
      </div>
      <div className="absolute bg-[#004b96] h-[39px] left-[1419px] rounded-[20px] top-[297px] w-[172px]" data-name="okey">
        <div className="absolute bg-[rgba(248,253,254,0)] inset-0 rounded-[5px]">
          <div aria-hidden="true" className="absolute border border-[#f8fdfe] border-solid inset-[-1px] pointer-events-none rounded-[6px]" />
        </div>
        <p className="absolute font-['Quicksand:Bold',sans-serif] font-bold inset-[30.43%_7.11%_30.43%_22.67%] leading-[normal] text-[#f8fdfe] text-[15px] text-center whitespace-pre-wrap">Search</p>
      </div>
      <div className="absolute bg-[#fafcff] h-[39px] left-[1020px] top-[1098px] w-[172px]" data-name="okey">
        <div className="absolute bg-[rgba(248,253,254,0)] inset-0 rounded-[5px]">
          <div aria-hidden="true" className="absolute border border-[#f8fdfe] border-solid inset-[-1px] pointer-events-none rounded-[6px]" />
        </div>
        <p className="absolute font-['Quicksand:Bold',sans-serif] font-bold inset-[30.43%_7.11%_30.43%_22.67%] leading-[normal] text-[12px] text-black text-center whitespace-pre-wrap">Export DOCX Report</p>
      </div>
      <div className="absolute bg-[#ece6f0] content-stretch flex h-[45px] items-center left-[354px] max-w-[720px] overflow-clip rounded-[28px] top-[1090px] w-[410px]" data-name="Search bar">
        <StateLayer />
      </div>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[661px] not-italic text-[#004b96] text-[24px] top-[1005px] w-[313px] whitespace-pre-wrap">NOTIFICATIONS</p>
      <div className="absolute h-[197px] left-[345px] top-[1159px] w-[856px]" data-name="image 5">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
        </div>
      </div>
      <div className="absolute h-[148px] left-[345px] top-[1356px] w-[856px]" data-name="image 7">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[866.33%] left-[-55.56%] max-w-none top-[-336.55%] w-[199.61%]" src={imgImage6} />
          </div>
        </div>
      </div>
      <div className="absolute h-[148px] left-[345px] top-[1495px] w-[856px]" data-name="image 8">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[650.85%] left-[-55.56%] max-w-none top-[-227.97%] w-[199.61%]" src={imgImage6} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[866.33%] left-[-55.56%] max-w-none top-[-336.55%] w-[199.61%]" src={imgImage6} />
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(0,122,255,0.5)] content-stretch flex h-[39px] items-center justify-center left-[1455px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[862px] w-[112px]" data-name="next page">
        <div className="flex flex-[1_0_0] h-[16.408px] items-center justify-center min-h-px min-w-px relative" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg] w-full">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] w-full">
              <p className="leading-none whitespace-pre-wrap">{`    Next   » `}</p>
            </div>
          </div>
        </div>
      </div>
      <button className="absolute bg-[rgba(0,122,255,0.5)] content-stretch cursor-pointer flex h-[39px] items-center justify-center left-[1232px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[862px] w-[112px]" data-name="previous page">
        <div className="flex flex-[1_0_0] h-[16.408px] items-center justify-center min-h-px min-w-px relative" style={{ "--transform-inner-width": "63", "--transform-inner-height": "15" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg] w-full">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] text-left w-full">
              <p className="leading-none whitespace-pre-wrap">{`«  Previous`}</p>
            </div>
          </div>
        </div>
      </button>
      <button className="absolute bg-[rgba(0,122,255,0.5)] content-stretch cursor-pointer flex h-[39px] items-center justify-center left-[1348px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[862px] w-[30px]" data-name="numbers">
        <div className="flex h-[16.262px] items-center justify-center relative shrink-0 w-[27.963px]" style={{ "--transform-inner-width": "7", "--transform-inner-height": "15" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg]">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16.149px] justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] text-left w-[27.898px]">
              <p className="leading-none whitespace-pre-wrap">1</p>
            </div>
          </div>
        </div>
      </button>
      <button className="absolute bg-[rgba(0,122,255,0.5)] content-stretch cursor-pointer flex h-[39px] items-center justify-center left-[1384px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[862px] w-[31px]" data-name="numbers">
        <div className="flex h-[16.262px] items-center justify-center relative shrink-0 w-[27.963px]" style={{ "--transform-inner-width": "7", "--transform-inner-height": "15" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg]">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16.149px] justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] text-left w-[27.898px]">
              <p className="leading-none whitespace-pre-wrap">2</p>
            </div>
          </div>
        </div>
      </button>
      <button className="absolute bg-[rgba(0,122,255,0.5)] content-stretch cursor-pointer flex h-[39px] items-center justify-center left-[1420px] pl-[20px] py-[10px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[862px] w-[30px]" data-name="numbers">
        <div className="flex h-[16.262px] items-center justify-center relative shrink-0 w-[27.963px]" style={{ "--transform-inner-width": "7", "--transform-inner-height": "15" } as React.CSSProperties}>
          <div className="flex-none rotate-[-0.23deg]">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16.149px] justify-center leading-[0] not-italic relative text-[#fef7ff] text-[16px] text-left w-[27.898px]">
              <p className="leading-none whitespace-pre-wrap">3</p>
            </div>
          </div>
        </div>
      </button>
      <div className="absolute h-[26px] left-[1353px] overflow-clip top-[305px] w-[25px]" data-name="Chevron down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
          <div className="absolute inset-[-7.69%_-4%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 7.5">
              <path d={svgPaths.p69a0e40} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute inset-[17.36%_41.71%_82.28%_57.68%]" data-name="Icon">
        <div className="absolute inset-[-7.69%_-4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 7.5">
            <path d={svgPaths.p69a0e40} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-[rgba(0,75,150,0.2)] blur-[2px] border border-black border-solid h-[79px] left-[377px] rounded-[20px] top-[352px] w-[1214px]" />
      <div className="absolute bg-[rgba(0,75,150,0.2)] blur-[2px] border border-black border-solid h-[407px] left-[377px] rounded-[20px] top-[446px] w-[1214px]" />
      <button className="absolute block cursor-pointer h-[19px] left-[418px] top-[383px] w-[21px]" data-name="check/uncheck">
        <div className="absolute bg-[#fff9f9] border border-[#111112] border-solid inset-0 rounded-[2px]" role="button" tabIndex="0" />
      </button>
      <div className="absolute h-[24px] left-[449px] top-[380px] w-[435px]" data-name="Forget password?">
        <p className="absolute font-['Quicksand:Medium',sans-serif] font-medium inset-0 leading-[normal] text-[#111112] text-[18px] whitespace-pre-wrap">Maintenance</p>
      </div>
      <button className="absolute block cursor-pointer h-[19px] left-[637px] top-[384px] w-[21px]" data-name="check/uncheck">
        <div className="absolute bg-[#fff9f9] border border-[#111112] border-solid inset-0 rounded-[2px]" role="button" tabIndex="0" />
      </button>
      <div className="absolute h-[24px] left-[668px] top-[381px] w-[435px]" data-name="Forget password?">
        <p className="absolute font-['Quicksand:Medium',sans-serif] font-medium inset-0 leading-[normal] text-[#111112] text-[18px] whitespace-pre-wrap">Vitamins</p>
      </div>
      <div className="absolute left-[1467px] overflow-clip size-[16px] top-[309px]" data-name="Search">
        <div className="absolute inset-[12.5%]" data-name="Icon">
          <div className="absolute inset-[-6.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.6 13.6">
              <path d={svgPaths.p8625680} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[1499px] overflow-clip size-[20px] top-[382px]" data-name="Plus circle">
        <div className="absolute inset-[8.33%]" data-name="Icon">
          <div className="absolute inset-[-6%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.6667 18.6667">
              <path d={svgPaths.pb735a00} id="Icon" stroke="var(--stroke-0, #34C759)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[1531px] overflow-clip size-[24px] top-[380px]" data-name="Delete">
        <div className="absolute inset-[16.67%_4.17%]" data-name="Icon">
          <div className="absolute inset-[-7.81%_-5.68%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.5 18.5">
              <path d={svgPaths.p26815e00} id="Icon" stroke="var(--stroke-0, #FF383C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute bg-white h-[314px] left-[402px] top-[522px] w-[1165px]" />
      <div className="absolute bg-white h-[59px] left-[401px] rounded-[20px] top-[479px] w-[226px]" />
      <div className="absolute bg-white h-[59px] left-[1450px] rounded-[20px] top-[479px] w-[117px]" />
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[429px] not-italic text-[#004b96] text-[15px] top-[493px] w-[313px] whitespace-pre-wrap">PATIENT INFORMATION:</p>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[1481px] not-italic text-[#004b96] text-[15px] top-[489px] w-[66px] whitespace-pre-wrap">FILTER</p>
      <div className="absolute bg-[rgba(251,253,255,0.2)] h-[626px] left-[30px] rounded-[30px] top-[61px] w-[279px]">
        <div aria-hidden="true" className="absolute border-5 border-[#004b96] border-solid inset-[-5px] pointer-events-none rounded-[35px]" />
      </div>
      <div className="absolute bg-[rgba(251,253,255,0.2)] h-[1047px] left-[30px] rounded-[30px] top-[722px] w-[279px]">
        <div aria-hidden="true" className="absolute border-5 border-[#004b96] border-solid inset-[-5px] pointer-events-none rounded-[35px]" />
      </div>
      <div className="absolute h-[252px] left-[75px] top-[68px] w-[189px]" data-name="Bloom & Grow (2) 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBloomGrow21} />
      </div>
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] h-[31px] leading-[normal] left-[167.5px] not-italic text-[#013155] text-[36px] text-center top-[271px] w-[217px] whitespace-pre-wrap">HEART</p>
      <p className="-translate-x-1/2 absolute font-['Inika:Bold',sans-serif] h-[31px] leading-[normal] left-[169.5px] not-italic text-[#013155] text-[19px] text-center top-[315px] w-[231px] whitespace-pre-wrap">Gov. Paciano Bangoy</p>
      <p className="-translate-x-1/2 absolute font-['Inika:Regular',sans-serif] h-[31px] leading-[normal] left-[169.5px] not-italic text-[#013155] text-[16px] text-center top-[338px] w-[231px] whitespace-pre-wrap">Barangay Health Center</p>
      <div className="absolute bg-[#d9d9d9] h-[118px] left-[54px] rounded-[20px] top-[375px] w-[231px]" />
      <div className="absolute bg-[#d9d9d9] h-[150px] left-[54px] rounded-[20px] top-[510px] w-[231px]" />
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[54px] not-italic text-[#004b96] text-[24px] top-[833px] w-[313px] whitespace-pre-wrap">BY PUROK:</p>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[925px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[883px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1008px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1047px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[966px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[54px] not-italic text-[#004b96] text-[24px] top-[1093px] w-[313px] whitespace-pre-wrap">BY PROGRAM:</p>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1185px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1143px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1268px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1307px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1226px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[54px] not-italic text-[#004b96] text-[24px] top-[1356px] w-[313px] whitespace-pre-wrap">BY YEAR:</p>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1448px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1406px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1531px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1570px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[67px] overflow-clip size-[24px] top-[1489px]" data-name="Folder">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-6.94%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 20.5">
              <path d={svgPaths.p6bbe170} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[42px] leading-[normal] left-[52px] not-italic text-[24px] text-black top-[747px] w-[227px] whitespace-pre-wrap">STORAGE FOLDERS</p>
      <div className="absolute flex h-px items-center justify-center left-[54px] top-[798px] w-[228px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-[-0.25deg]">
          <div className="h-0 relative w-[228.002px]">
            <div className="absolute inset-[-3px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 228.002 3">
                <line id="Line 2" stroke="var(--stroke-0, black)" strokeWidth="3" x2="228.002" y1="1.5" y2="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <button className="absolute bg-[#013155] block cursor-pointer h-[19px] left-[1428px] top-[1681px] w-[21px]" data-name="check/uncheck">
        <div className="absolute bg-[#fff9f9] border border-[#007aff] border-solid inset-0 rounded-[2px]" role="button" tabIndex="0" />
      </button>
      <div className="absolute h-[24px] left-[1456px] top-[1680px] w-[435px]" data-name="Forget password?">
        <p className="absolute font-['Quicksand:Medium',sans-serif] font-medium inset-0 leading-[normal] text-[#007aff] text-[15px] whitespace-pre-wrap">I agree to the terms of service and Privacy Policy</p>
      </div>
    </div>
  );
}